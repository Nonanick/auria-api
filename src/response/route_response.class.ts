import { IRouteResponse } from './route_response.type';
import { ICommand } from '../command/command.type';
import { IRouteRequest } from '../request/route_request.type';

export class RouteResponse implements IRouteResponse {

  exitCode: string = "OK";
  status: number = 201;
  payload: any;
  
  headers : {
    [name : string] : string
  } = {};

  commands?: ICommand | ICommand[];

  constructor(public request: IRouteRequest) { }

}