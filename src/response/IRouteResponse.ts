import { IApiCommand } from "../command/IApiCommand";

export interface IApiRouteResponse {
  exitCode: string;
  status: number;
  payload: any;
  commands?: IApiCommand | IApiCommand[];
}

export function implementsRouteResponse(resp: any): resp is IApiRouteResponse {
  if (resp == null) {
    return false;
  }

  return (
    typeof resp.exitCode === "string" &&
    typeof resp.status === "number" &&
    (Array.isArray(resp.commands) || resp.commands === undefined)
  );
}
