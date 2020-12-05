import { IRouteResponse } from './IRouteResponse';
import { ICommand } from '../command/ICommand';
import { IRouteRequest } from '../request/IRouteRequest';

export class RouteResponse implements IRouteResponse {

  exitCode: string = "OK";
  status: number = 201;
  payload: any;
  commands?: ICommand | ICommand[];

  constructor(public request: IRouteRequest) { }

}