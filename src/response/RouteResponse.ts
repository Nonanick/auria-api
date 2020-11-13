import { IApiRouteResponse } from './IRouteResponse';
import { ICommand } from '../command/ICommand';

export class RouteResponse implements IApiRouteResponse {

  exitCode: string = "OK";
  status: number = 201;
  payload: any;
  commands?: ICommand | ICommand[];

}