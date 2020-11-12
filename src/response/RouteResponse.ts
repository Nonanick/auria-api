import { IApiRouteResponse } from './IRouteResponse';
import { IApiCommand } from '../command/IApiCommand';

export class RouteResponse implements IApiRouteResponse {

  exitCode: string = "OK";
  status: number = 201;
  payload: any;
  commands?: IApiCommand | IApiCommand[];

}