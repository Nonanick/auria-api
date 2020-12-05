import { ICommand } from "../command/ICommand";
import { IRouteRequest } from '../request/IRouteRequest';

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
