import express, { Application, Request, Response, NextFunction, RequestHandler} from 'express';
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

export class ExpressAdapter implements IApiAdapter {

  public static ADAPTER_NAME = "Express";

  protected express : Application;

  protected containers : ApiContainer[] = [];

  protected _port : number = Number(process.env.EXPRESS_PORT) ?? 3333;

  protected _booted = false;

  protected _middlewares : {
    [matcher : string] : ExpressMiddleware[]
  } = {};

  protected _transformRequest : typeof ExpressTransformRequest = ExpressTransformRequest;
  
  protected _validateApiCallRequest : ValidateApiCallRoutine = DefaultRouteRequestValidation;

  protected _apiCallRoutine : ApiCallRoutine = ExpressRouteRoutine;

  protected _sendResponse : typeof ExpressSendResponse = ExpressSendResponse;

  constructor() {
    this.express = express();
  }

  setCallRouteRoutine(routine : ApiCallRoutine) {
    this._apiCallRoutine = routine;
  }

  setRouteRequestValidation(validation : ValidateApiCallRoutine) {
    this._validateApiCallRequest = validation;
  }
  
  setTransformRequestRoutine(routine : typeof ExpressTransformRequest) {
    this._transformRequest = routine;
  }

  setSendResponseRoutine(routine : typeof ExpressSendResponse) {
    this._sendResponse = routine;
  }

  addApiContainer(container : ApiContainer) {
    // Prevent duplicates
    if(!this.containers.includes(container)){
      this.containers.push(container);
    }
  }

  addGETApiRoute(route : IProxiedApiRoute) {

  }

  addPOSTApiRoute(route : IProxiedApiRoute) {

  }

  addPUTApiRoute(route : IProxiedApiRoute) {

  }

  addPATCHApiRoute(route : IProxiedApiRoute) {

  }

  addDELETEApiRoute(route : IProxiedApiRoute) {

  }

  use(handler : RequestHandler) : void{
    this.express.use(handler);
  }

  boot() {
    this.use(bodyParser.json());
    this.use(bodyParser.urlencoded({extended : true}));
    this.use(cookieParser());
  }

  onPort(port : number) {
    this._port = port;
  }

  run() {
    this.boot();
    this.express.listen(this._port);
  }

}

type ExpressMiddleware = (req : Request, res : Response, next : NextFunction) => void;