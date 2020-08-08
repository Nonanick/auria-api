import { IApiRequestProxy } from '../proxy/IApiRequestProxy';

export interface IApiRouteRequest {

  readonly adapter : string;

  readonly originalURL : string;

  identification : string;

  method?: string;

  url : string;

  appliedProxies?: IApiRequestProxy[];

  getParameter(name : string, origin? : string) : any | undefined;
  hasParameter(name : string, origin? : string) : boolean;
  addParameter(name : string, value : any, origin? : string) : void;
  removeParameter(name : string, value : any, origin? : string) : void;

  readonly parameters? : {
    [name : string] : any
  };

  readonly parametersByOrigin? : {
    [originName : string] : {
      [name : string] : any
    }
  };


}