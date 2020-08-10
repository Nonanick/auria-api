import express, { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { IApiAdapter } from '../IApiAdapter';
import { ApiContainer } from '../../container/ApiContainer';
import { IProxiedApiRoute } from '../../proxy/IProxiedApiRoute';
import { ExpressTransformRequest } from './ExpressTransformRequest';
import { ExpressSendResponse } from './ExpressSendResponse';
import { IApiContainer } from '../../container/IApiContainer';
import { HTTPMethod } from '../../route/HTTPMethod';
import { ExpressErrorHandler } from './ExpressErrorHandler';
import { ApiRequestHandler } from '../../maestro/ApiRequestHandler';
import { EventEmitter } from 'events';
import { RequestFlowNotDefined } from '../../error/exceptions/RequestFlowNotDefined';
import { Server } from 'http';
import { ExpressEvents } from './ExpressEvents';

export class ExpressAdapter extends EventEmitter implements IApiAdapter {

  public static ADAPTER_NAME = "Express";

  get name(): string {
    return ExpressAdapter.ADAPTER_NAME;
  }

  /**
   * Express application
   * -------------------
   * Holds the actual express application
   * 
   */
  protected express: Application;

  /**
   * Containers
   * ------------
   * Hold all the API Containers that will be exposed to the 
   * Express Adapter
   */
  protected containers: ApiContainer[] = [];

  /**
   * Port
   * ----
   * Which port the adapter will run
   */
  protected _port: number = Number(process.env.EXPRESS_PORT) ?? 3333;

  /**
   * Booted
   * -------
   * Boot state of the adapter
   */
  protected _booted = false;

  /**
   * Started
   * --------
   * Start state of the adapter
   */
  protected _started = false;

  /**
   * Server
   * ------
   * HTTP Server created when the adapter is started
   */
  protected _server?: Server;

  /**
   * Loaded Routes
   * --------------
   * All Routes that were already 'loaded'
   * and are therefore exposed 
   */
  protected _loadedRoutes: IProxiedApiRoute[] = [];

  /**
   * Transform Request
   * -----------------
   * Holds the function that shall normalize a Request input
   * into an *IApiRouteRequest*
   */
  protected _transformRequest: typeof ExpressTransformRequest = ExpressTransformRequest;

  /**
   * Send Response
   * ---------------
   * Holds the function that shall output an IApiRouteResponse
   * as an actual HTTP Response (usually in JSON format)
   */
  protected _sendResponse: typeof ExpressSendResponse = ExpressSendResponse;

  /**
   * Request Handler
   * ---------------
   * Responsible for orchestrating the flow of a request
   * Steps taken by the default flow:
   * 1. Trasnform Request
   * 2. Call the API Request Handler set in the adapter (Usually an APIMaestro handle function)
   * > 2.1 The API Handler has access to a normalized function to either send the IApiRouteResponse
   * > or an error
   * 
   * @param route Route that the request is directed to
   * @param method Http method used to fetch the request
   * @param request Express Request object
   * @param response Express Response object
   * @param next Express NextFunction, usually called when an error has ocurred
   */
  protected _requestHandler = async (
    route: IProxiedApiRoute,
    method: HTTPMethod,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {

    if (typeof this._apiHandler !== "function") {
      let error = new RequestFlowNotDefined(
        'Express adatper does not have an associated api request handler'
      );
      this._errorHanlder(
        response,
        next,
        error
      );
      this.emit(ExpressEvents.REQUEST_ERROR, error, route, request);
    }

    // Create API Request
    let apiRequest = this._transformRequest(request);
    apiRequest.method = method;

    // Send it to API Handler
    this._apiHandler!(
      route,
      apiRequest,
      (routeResp) => {
        this._sendResponse(routeResp, response);
        this.emit(ExpressEvents.REQUEST_RESPONSE, routeResp, route);
      },
      (error) => {
        this._errorHanlder(response, next, error);
        this.emit(ExpressEvents.REQUEST_ERROR, error, route, request);
      }
    );

  };

  /**
   * Actual API Hanlder
   * -------------------
   * Express adapter is only responsible for normalizing the Input/Output
   * of the API, therefore properly translating the Express request
   * into an *IApiRouteRequest* and them outputing the *IApiRouteResponse*
   * 
   * All other steps should be done by an 'api request hanlder', how this handler
   * will manage all the processes of validating the request, calling the resolver
   * checking for possible errors and so on is no concern to the adapter!
   */
  protected _apiHandler?: ApiRequestHandler;

  /**
   * Error Handler
   * --------------
   * Function that allows the API Handler to output errors through the default
   * Express Error Handler or any other adapter error handler
   */
  protected _errorHanlder: typeof ExpressErrorHandler = ExpressErrorHandler;

  constructor() {
    super();
    this.express = express();
  }

  /**
   * [SET] Transform Request Function
   * ---------------------------------
   * Defines the function that the adapter will use to
   * transform an Express Request into an *iApiRouteRequest*
   * 
   * @param func 
   */
  setTransformRequestFunction(func: typeof ExpressTransformRequest) {
    this._transformRequest = func;
  }

  /**
   * [SET] Send Response
   * --------------------
   * Defines the function that will output through express
   * an *IApiResponse* object
   * 
   * @param func 
   */
  setSendResponseFunction(func: typeof ExpressSendResponse) {
    this._sendResponse = func;
  }

  /**
   * [SET] Error Handler
   * -------------------
   * Defines how the adapter will output errors
   * @param handler 
   */
  setErrorHanlder(handler: typeof ExpressErrorHandler) {
    this._errorHanlder = handler;
  }

  /**
   * [SET] Request Handler
   * ----------------------
   * Defines the function that will actually be repsonsible
   * for transforming the IApiRouteRequest into an IAPiRouteResponse
   * 
   * All other steps like parameter validation, schema validation
   * check for errors must be done by this handler
   * 
   * @param handler 
   */
  setRequestHanlder(handler: ApiRequestHandler) {
    this._apiHandler = handler;
  }

  /**
   * [ADD] API Container
   * --------------------
   * Add a new API Container to the Express adapter
   * exposing its routes as acessible URL's when
   * the adapter in started
   * 
   * @param container 
   */
  addApiContainer(container: ApiContainer) {
    // Prevent duplicates
    if (!this.containers.includes(container)) {
      this.containers.push(container);
    }
  }

  /**
   * Use
   * -------
   * Wrapper for Express *use* function
   * 
   * @param handler 
   */
  use(handler: RequestHandler): void {
    this.express.use(handler);
  }

  boot() {

    if (this._booted) return;

    // Add needed express capabilities
    this.use(bodyParser.json());
    this.use(bodyParser.urlencoded({ extended: true }));
    this.use(cookieParser());

    // Add all routes from currently known containers
    this.loadRoutesFromContainers(this.containers);

    this._booted = true;
  }

  /**
   * Load Routes From Containers
   * ---------------------------
   * Crawls into the container fetching all exposed routes
   * Assign them to the express server using the adapters
   * *Request Hanlder*
   * 
   * @param containers All Containers that will have thei api routes exposed
   */
  loadRoutesFromContainers(containers: IApiContainer[]) {

    for (let container of containers) {

      const allRoutes = container.allRoutes();

      for (let route of allRoutes) {
        // Already loaded? Do not add duplicates
        if (this._loadedRoutes.includes(route)) {
          continue;
        }

        if (Array.isArray(route.methods)) {
          for (let method of route.methods) {
            this.addRouteToHttpMethod(method, route);
          }
        } else {
          this.addRouteToHttpMethod(route.methods, route);
        }

        this._loadedRoutes.push(route);

      }
    }
  }

  /**
   * Add Route to HTTP Method
   * ------------------------
   * Actually binds the Api Route resolver to the URL + Method
   * it is assigned to into the express app;
   * 
   * @param method HTTPMethod that will be listened
   * @param route Route corresponding to the URL + Method
   */
  protected addRouteToHttpMethod(method: HTTPMethod, route: IProxiedApiRoute) {
    switch (method) {
      case 'all':
        this.express.all(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.ALL_REQUEST, route);
        break;
      case 'get':
        this.express.get(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.GET_REQUEST, route);
        break;
      case 'post':
        this.express.post(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.POST_REQUEST, route);
        break;
      case 'put':
        this.express.put(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.PUT_REQUEST, route);
        break;
      case 'patch':
        this.express.patch(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.PATCH_REQUEST, route);
        break;
      case 'delete':
        this.express.delete(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.DELETE_REQUEST, route);
        break;
      case 'head':
        this.express.head(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.HEAD_REQUEST, route);
        break;
      case 'options':
        this.express.options(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.OPTIONS_REQUEST, route);
        break;
      case 'connect':
        this.express.connect(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.CONNECT_REQUEST, route);
        break;
      case 'trace':
        this.express.trace(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        this.emit(ExpressEvents.TRACE_REQUEST, route);
        break;
    }

    this.emit(ExpressEvents.REQUEST, route, method);

  }

  /**
   * On Port
   * --------
   * Defines the port the server should be started at
   * Cannot be modified once the server has started
   * 
   * @param port 
   */
  onPort(port: number) {
    if (this._started) return;
    this._port = port;
  }

  start() {
    this.boot();
    this._server = this.express.listen(this._port);
    this._started = true;
  }

  stop() {
    if (this._started) {
      this._server!.close();
      this._started = false;
    }
  }

  loadedRoutes(): RoutesByURL {
    let loaded: RoutesByURL = {};
    for (let route of this._loadedRoutes) 
      loaded[route.url] = route;

    return loaded;
  }

}

type RoutesByURL = {
  [routeURL : string] : IProxiedApiRoute
};