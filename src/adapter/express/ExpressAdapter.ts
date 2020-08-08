import express, { Application, Request, Response, NextFunction, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { IApiAdapter } from '../IApiAdapter';
import { ApiContainer } from '../../container/ApiContainer';
import { IProxiedApiRoute } from '../../proxy/IProxiedApiRoute';
import { ApiCallRoutine } from '../../routine/ApiCallRoutine';
import { ExpressRouteRoutine } from './ExpressRouteRoutine';
import { ExpressTransformRequest } from './ExpressTransformRequest';
import { ExpressSendResponse } from './ExpressSendResponse';
import { ValidateApiCallRoutine } from '../../routine/ValidateApiCallRoutine';
import { DefaultRouteRequestValidation } from '../../routine/DefaultRouteRequestValidation';
import { IApiContainer } from '../../container/IApiContainer';
import { HTTPMethod } from '../../route/HTTPMethod';
import { ApiError } from '../../error/ApiError';
import { ApiException } from '../../error/ApiException';
import { ExpressErrorHandler } from './ExpressErrorHandler';

export class ExpressAdapter implements IApiAdapter {

  public static ADAPTER_NAME = "Express";

  get name(): string {
    return ExpressAdapter.ADAPTER_NAME;
  }

  protected express: Application;

  protected containers: ApiContainer[] = [];

  protected _port: number = Number(process.env.EXPRESS_PORT) ?? 3333;

  protected _booted = false;

  protected _loadedRoutes: IProxiedApiRoute[] = [];

  protected _middlewares: {
    [matcher: string]: ExpressMiddleware[]
  } = {};

  protected _transformRequest: typeof ExpressTransformRequest = ExpressTransformRequest;

  protected _validateApiCallRequest: ValidateApiCallRoutine = DefaultRouteRequestValidation;

  protected _apiCallRoutine: ApiCallRoutine = ExpressRouteRoutine;

  protected _sendResponse: typeof ExpressSendResponse = ExpressSendResponse;

  protected _requestHandler = async (
    route: IProxiedApiRoute,
    method: HTTPMethod,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {

    // Create API Request
    let apiRequest = this._transformRequest(request);
    apiRequest.method = method;

    // Validate Parameter Policies
    let isValidRequest = this._validateApiCallRequest(route, apiRequest);
    if (isValidRequest !== true) {
      this._errorHanlder(response, next, isValidRequest);
      return;
    }

    // Call API
    let apiResponse = await this._apiCallRoutine(route, apiRequest);
    if (apiResponse instanceof ApiError || apiResponse instanceof ApiException) {
      this._errorHanlder(response, next, apiResponse);
      return;
    }

    this._sendResponse(apiResponse, response);

  };

  protected _errorHanlder: typeof ExpressErrorHandler = ExpressErrorHandler;

  constructor() {
    this.express = express();
  }

  setCallRouteRoutine(routine: ApiCallRoutine) {
    this._apiCallRoutine = routine;
  }

  setRouteRequestValidation(validation: ValidateApiCallRoutine) {
    this._validateApiCallRequest = validation;
  }

  setTransformRequestRoutine(routine: typeof ExpressTransformRequest) {
    this._transformRequest = routine;
  }

  setSendResponseRoutine(routine: typeof ExpressSendResponse) {
    this._sendResponse = routine;
  }

  setErrorHanlder(handler : typeof ExpressErrorHandler) {
    this._errorHanlder = handler;
  }

  addApiContainer(container: ApiContainer) {
    // Prevent duplicates
    if (!this.containers.includes(container)) {
      this.containers.push(container);
    }
  }

  use(handler: RequestHandler): void {
    this.express.use(handler);
  }

  boot() {
    this.use(bodyParser.json());
    this.use(bodyParser.urlencoded({ extended: true }));
    this.use(cookieParser());
    this.loadRoutesFromContainers(this.containers);
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
  protected loadRoutesFromContainers(containers: IApiContainer[]) {

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
      case 'get':
        this.express.get(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'post':
        this.express.post(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'put':
        this.express.put(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'patch':
        this.express.patch(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'delete':
        this.express.delete(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'head':
        this.express.head(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'options':
        this.express.options(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'connect':
        this.express.connect(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
      case 'trace':
        this.express.trace(route.url, (req, res, next) => {
          this._requestHandler(route, method, req, res, next);
        });
        return;
    }
  }

  onPort(port: number) {
    this._port = port;
  }

  run() {
    this.boot();
    this.express.listen(this._port);
  }

}

type ExpressMiddleware = (req: Request, res: Response, next: NextFunction) => void;