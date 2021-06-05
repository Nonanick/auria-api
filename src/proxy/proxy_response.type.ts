import { IRouteResponse } from '../response/route_response.type';
import { Maybe, MaybePromise } from '../error/maybe.type';

export interface IProxyResponse {
  name: string;
  apply(response: IRouteResponse): Maybe<IRouteResponse> | MaybePromise<IRouteResponse>;
  discoverable?: boolean;
}