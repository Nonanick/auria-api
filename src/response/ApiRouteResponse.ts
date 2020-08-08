import { IApiRouteResponse } from './IApiRouteResponse';
import { IApiCommand } from '../command/IApiCommand';

export class ApiRouteResponse  implements IApiRouteResponse {

  exitCode: string = "OK";
  status: number = 201;
  payload: any;
  commands?: IApiCommand | IApiCommand[];

}