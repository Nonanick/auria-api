import { IRouteRequest } from "../../request/route_request.type";

export interface IValidateRoute {
  name: string;
  discoverable?: boolean;
  validate: (parameters: {
    [originName: string]: {
      [name: string]: any;
    };
  }) => Promise<true | Error | Error[]>;
}