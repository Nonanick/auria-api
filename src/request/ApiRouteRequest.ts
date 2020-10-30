import { IApiRouteRequest } from './IApiRouteRequest';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';

export class ApiRouteRequest implements IApiRouteRequest {

  private static EMPTY_ORIGIN_NAME = '_';

  private static DEBUG_REQUEST_LIFECYCLE = process.env.NODE_ENV === "development";

  protected _adapter: string;

  get adapter(): string {
    return this._adapter;
  }

  protected _originalURL: string;

  get originalURL(): string {
    return this._originalURL;
  };

  identification: string = "";

  url: string;

  method?: string;

  constructor(adapter: string, url: string) {
    this._adapter = adapter;
    this._originalURL = url;
    this.url = url;
  }

  protected _proxies: IApiRequestProxy[] = [];

  get appliedProxies(): IApiRequestProxy[] {
    return [...this._proxies];
  }

  set appliedProxies(proxies: IApiRequestProxy[]) {
    this._proxies = [
      ...this._proxies, // Currently applied proxies
      ...proxies.filter(p => !this._proxies.includes(p)) // Unique new proxies (?)
    ];
  }

  get(name: string, origin = ApiRouteRequest.EMPTY_ORIGIN_NAME) {
    // Asking for a specific origin?
    if (origin != ApiRouteRequest.EMPTY_ORIGIN_NAME) {
      if (this._parametersByOrigin[origin] != null) {
        return this._parametersByOrigin[origin][name] ?? undefined;
      }
      else {
        return undefined;
      }
    }
    // If not use 'all parameters'
    return this._allParameters[name];
  }

  has(name: string, origin = ApiRouteRequest.EMPTY_ORIGIN_NAME): boolean {
    // Asking for a specific origin?
    if (origin != ApiRouteRequest.EMPTY_ORIGIN_NAME) {
      if (this._parametersByOrigin[origin] != null) {
        return this._parametersByOrigin[origin][name] != null;
      }
      else {
        return false;
      }
    }
    // If not use 'all parameters'
    return this._allParameters[name] != null;
  }

  protected _allParameters: RequestParameters = {};

  protected _parametersByOrigin: ParametersByOrigin = {};

  get parameters(): RequestParameters {
    return { ...this._allParameters };
  }

  add(name: string, value: any, from = ApiRouteRequest.EMPTY_ORIGIN_NAME) {

    if (this._parametersByOrigin[from] == null) {
      this._parametersByOrigin[from] = {};
    }
    this._parametersByOrigin[from] = {
      ...this._parametersByOrigin[from],
      [name]: value
    };
    this._allParameters[name] = value;
  }

  remove(name: string, from = ApiRouteRequest.EMPTY_ORIGIN_NAME) {
    if (this._parametersByOrigin[from] == null) {
      this._parametersByOrigin[from] = {};
    }

    if (this._parametersByOrigin[from][name] != null) {
      let paramValue = this._parametersByOrigin[from][name];
      delete this._parametersByOrigin[from][name];

      // Repopulate 'All' parameters?
      if (this._allParameters[name] === paramValue) {
        delete this._allParameters[name];

        // Deleted ALL Parameters, it should repopulate if there are other values!
        for (let existingOrigins in this._parametersByOrigin) {
          // Skip removed origin
          if (existingOrigins === from) {
            continue;
          }
          // If there were previous shadowed value, update!
          if (this._parametersByOrigin[existingOrigins][name] != null) {
            let value = this._parametersByOrigin[existingOrigins][name];
            this._allParameters[name] = value;
            break;
          }
        }
      }
    }
  }

  /**
   * Parameters By Origin
   * --------------------
   * Return all parameters that have an origin
   */
  get getByOrigin(): ParametersByOrigin {
    let all = { ...this._parametersByOrigin };
    return all;
  }
}

type RequestParameters = {
  [parameterName: string]: any;
};

type ParametersByOrigin = {
  [originName: string]: RequestParameters;
};