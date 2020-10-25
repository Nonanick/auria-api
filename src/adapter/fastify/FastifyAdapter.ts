import { EventEmitter } from 'events';
import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyHelmet from 'fastify-helmet';
import fastifyMultipart from 'fastify-multipart';
import { Server } from 'http';
import { ApiContainer } from '../../container/ApiContainer';
import { IApiContainer } from '../../container/IApiContainer';
import { RequestFlowNotDefined } from '../../error/exceptions/RequestFlowNotDefined';
import { ApiMaestro } from '../../maestro/ApiMaestro';
import { RequestHandler } from '../../maestro/composition/RequestHandler';
import { IProxiedApiRoute } from '../../proxy/IProxiedApiRoute';
import { HTTPMethod } from '../../route/HTTPMethod';
import { IApiAdapter } from '../IApiAdapter';
import { FastifyErrorHandler } from './FastifyErrorHandler';
import { FastifyEvents } from './FastifyEvents';
import { FastifySendResponse } from './FastifySendResponse';
import { FastifyTransformRequest } from './FastifyTransformRequest';

export class FastifyAdapter extends EventEmitter implements IApiAdapter {

  public static ADAPTER_NAME = "Fastify";

  get name(): string {
    return FastifyAdapter.ADAPTER_NAME;
  }

  get port(): number {
    return this._port;
  }

  /**
   * Fastify application
   * -------------------
   * Holds the actual fastify application
   * 
   */
  protected fastify: FastifyInstance;

  /**
   * Containers
   * ------------
   * Hold all the API Containers that will be exposed to the 
   * Fastidy Adapter
   */
  protected containers: ApiContainer[] = [];

  /**
   * Port
   * ----
   * Which port the adapter will run
   */
  protected _port: number = Number(process.env.FASTIFY_PORT) ?? 3333;

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
  protected _transformRequest: typeof FastifyTransformRequest = FastifyTransformRequest;

  /**
   * Send Response
   * ---------------
   * Holds the function that shall output an IApiRouteResponse
   * as an actual HTTP Response (usually in JSON format)
   */
  protected _sendResponse: typeof FastifySendResponse = FastifySendResponse;

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
   * @param request Fastify Request object
   * @param response Fastify Response object
   */
  protected _requestHandler = async (
    route: IProxiedApiRoute,
    method: HTTPMethod,
    request: FastifyRequest,
    response: FastifyReply
  ) => {

    if (typeof this._apiHandler !== "function") {
      let error = new RequestFlowNotDefined(
        'Fastfy adatper does not have an associated api request handler'
      );
      this._errorHanlder(
        response,
        error
      );
      this.emit(FastifyEvents.REQUEST_ERROR, error, route, request);
    }

    // Create API Request
    let apiRequest = await this._transformRequest(request);
    apiRequest.method = method;

    // Send it to API Handler
    this._apiHandler!(
      route,
      apiRequest,
      (routeResp) => {
        this._sendResponse(routeResp, response);
        this.emit(FastifyEvents.REQUEST_RESPONSE, routeResp, route);
      },
      (error) => {
        this._errorHanlder(response, error);
        this.emit(FastifyEvents.REQUEST_ERROR, error, route, request);
      }
    );

  };

  /**
   * Actual API Hanlder
   * -------------------
   * Fastify adapter is only responsible for normalizing the Input/Output
   * of the API, therefore properly translating the Fastify request
   * into an *IApiRouteRequest* and them outputing the *IApiRouteResponse*
   * 
   * All other steps should be done by an 'api request hanlder', how this handler
   * will manage all the processes of validating the request, calling the resolver
   * checking for possible errors and so on is no concern to the adapter!
   */
  protected _apiHandler?: ApiMaestro['handle'];

  /**
   * Error Handler
   * --------------
   * Function that allows the API Handler to output errors through the default
   * Fastify Error Handler or any other adapter error handler
   */
  protected _errorHanlder: typeof FastifyErrorHandler = FastifyErrorHandler;

  constructor() {
    super();
    this.fastify = fastify({
      logger: true,
    });

  }

  /**
   * [SET] Transform Request Function
   * ---------------------------------
   * Defines the function that the adapter will use to
   * transform an Fastify Reply into an *iApiRouteRequest*
   * 
   * @param func 
   */
  setTransformRequestFunction(func: typeof FastifyTransformRequest) {
    this._transformRequest = func;
  }

  /**
   * [SET] Send Response
   * --------------------
   * Defines the function that will output through fastidy
   * an *IApiResponse* object
   * 
   * @param func 
   */
  setSendResponseFunction(func: typeof FastifySendResponse) {
    this._sendResponse = func;
  }

  /**
   * [SET] Error Handler
   * -------------------
   * Defines how the adapter will output errors
   * @param handler 
   */
  setErrorHanlder(handler: typeof FastifyErrorHandler) {
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
  setRequestHandler(handler: ApiMaestro['handle']) {
    this._apiHandler = handler;
  }

  /**
   * [ADD] API Container
   * --------------------
   * Add a new API Container to the fastidy adapter
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

  boot() {

    if (this._booted) return;

    // Add needed fastify capabilities
    this.fastify.register(fastifyCookie, {
      secret: '',
    });

    this.fastify.register(fastifyHelmet);

    this.fastify.register(fastifyMultipart);

    console.debug("\nAll avaliable routes:\n----------------------");
    // Add all routes from currently known containers
    this.loadRoutesFromContainers(this.containers);
    console.debug();
    this._booted = true;
  }

  /**
   * Load Routes From Containers
   * ---------------------------
   * Crawls into the container fetching all exposed routes
   * Assign them to the fastify server using the adapters
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
        let methods: HTTPMethod[];

        if (!Array.isArray(route.methods)) {
          methods = [route.methods];
        } else {
          methods = route.methods;
        }

        console.debug('-', methods.map(m => m.toLocaleUpperCase()).join(', '), `- ${route.url}`);
        for (let method of methods) {
          this.addRouteToHttpMethod(method, route);
        }


        this._loadedRoutes.push(route);

      }
    }
  }

  /**
   * Add Route to HTTP Method
   * ------------------------
   * Actually binds the Api Route resolver to the URL + Method
   * it is assigned to into the fastify app;
   * 
   * @param method HTTPMethod that will be listened
   * @param route Route corresponding to the URL + Method
   */
  protected addRouteToHttpMethod(method: HTTPMethod, route: IProxiedApiRoute) {
    let url: string;

    if (route.url.trim().charAt(0) !== '/') {
      url = '/' + route.url.trim();
    } else {
      url = route.url.trim();
    }

    this.fastify.route(
      {
        method: method.toLocaleUpperCase() as any,
        url,
        handler: async (req, res) => {
          this._requestHandler(route, method, req, res);
        },
      }
    );

    switch (method) {
      case 'all':
        this.emit(FastifyEvents.ALL_REQUEST, route);
        break;
      case 'get':
        this.emit(FastifyEvents.GET_REQUEST, route);
        break;
      case 'post':
        this.emit(FastifyEvents.POST_REQUEST, route);
        break;
      case 'put':
        this.emit(FastifyEvents.PUT_REQUEST, route);
        break;
      case 'patch':
        this.emit(FastifyEvents.PATCH_REQUEST, route);
        break;
      case 'delete':
        this.emit(FastifyEvents.DELETE_REQUEST, route);
        break;
      case 'head':
        this.emit(FastifyEvents.HEAD_REQUEST, route);
        break;
      case 'options':
        this.emit(FastifyEvents.OPTIONS_REQUEST, route);
        break;
      case 'connect':
        this.emit(FastifyEvents.CONNECT_REQUEST, route);
        break;
      case 'trace':
        this.emit(FastifyEvents.TRACE_REQUEST, route);
        break;
    }

    this.emit(FastifyEvents.REQUEST, route, method);

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
    this.fastify.listen(this._port > 0 ? this._port : 3031);
    this._server = this.fastify.server;
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
  [routeURL: string]: IProxiedApiRoute;
};