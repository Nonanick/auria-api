import { IApiRouteResponse } from './IRouteResponse';
import { ICommand } from '../command/ICommand';
import { IRouteRequest } from '../request/IRouteRequest';

export class RouteResponse implements IApiRouteResponse {

  exitCode: string = "OK";
  status: number = 201;
  payload: any;
  commands?: ICommand | ICommand[];

  constructor(public request: IRouteRequest) { }

}