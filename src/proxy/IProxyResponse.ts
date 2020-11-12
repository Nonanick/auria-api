import { IApiRouteResponse } from '../response/IRouteResponse';
import { Maybe, MaybePromise } from '../error/Maybe';

export interface IApiResponseProxy {
  name: string;
  apply(response: IApiRouteResponse): Maybe<IApiRouteResponse> | MaybePromise<IApiRouteResponse>;
}