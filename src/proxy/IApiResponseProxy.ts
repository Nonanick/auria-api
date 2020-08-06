import { IApiRouteResponse } from '../response/IApiRouteResponse';
import { Maybe } from '../error/Maybe';

export interface IApiResponseProxy {
  name : string;
  apply(response : IApiRouteResponse) : Maybe<IApiRouteResponse>;
}