import { IProxyRequest } from '../proxy/IProxyRequest';

export interface IRouteRequest {

  readonly timestamp: number;

  readonly adapter: string;

  readonly originalURL: string;

  readonly matchedPattern: string;

  identification: string;

  method?: string;

  url: string;

  appliedProxies?: IProxyRequest[];

  readonly rawParameters: any;
  setAsRaw(): void;

  get(name: string, from?: string): any | undefined;
  get(name: string[], from?: string): {[value in typeof name[number]] : any} | undefined;

  
  has(name: string, from?: string): boolean;
  add(name: string, value: any, from?: string): void;
  add(obj : {[prop : string] : any}, from? : string) : void;
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