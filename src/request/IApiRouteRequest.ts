import { IApiRequestProxy } from '../proxy/IApiRequestProxy';

export interface IApiRouteRequest {

  readonly adapter: string;

  readonly originalURL: string;

  identification: string;

  method?: string;

  url: string;

  appliedProxies?: IApiRequestProxy[];

  get(name: string, from?: string): any | undefined;
  has(name: string, from?: string): boolean;
  add(name: string, value: any, from?: string): void;
  remove(name: string, from?: string): void;

  readonly parameters?: {
    [name: string]: any;
  };

  readonly getByOrigin?: {
    [originName: string]: {
      [name: string]: any;
    };
  };


}