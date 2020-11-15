import { IProxyRequest } from '../proxy/IProxyRequest';

export interface IRouteRequest {

  readonly adapter: string;

  readonly originalURL: string;

  readonly matchedPattern: string;

  identification: string;

  method?: string;

  url: string;

  appliedProxies?: IProxyRequest[];

  get(name: string, from?: string): any | undefined;
  has(name: string, from?: string): boolean;
  add(name: string, value: any, from?: string): void;
  remove(name: string, from?: string): void;

  setOrigin(name: string, value: any): void;
  getOrigin<T = any>(name: string): T;

  readonly parameters?: {
    [name: string]: any;
  };

  readonly byOrigin?: {
    [originName: string]: {
      [name: string]: any;
    };
  };


}