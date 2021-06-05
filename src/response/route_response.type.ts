import { ICommand } from "../command/command.type";
import { IRouteRequest } from '../request/route_request.type';

export interface IRouteResponse {
  request: IRouteRequest;
  exitCode: string;
  status: number;
  payload: any;
  commands?: ICommand | ICommand[];
}

export function implementsRouteResponse(resp: any): resp is IRouteResponse {
  if (resp == null) {
    return false;
  }

  return (
    typeof resp.exitCode === "string" &&
    typeof resp.status === "number" &&
    (Array.isArray(resp.commands) || resp.commands === undefined)
  );
}
