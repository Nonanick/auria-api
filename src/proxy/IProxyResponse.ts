import { IRouteResponse } from '../response/IRouteResponse';
import { Maybe, MaybePromise } from '../error/Maybe';

export interface IProxyResponse {
  name: string;
  apply(response: IRouteResponse): Maybe<IRouteResponse> | MaybePromise<IRouteResponse>;
}