import { IRouteRequest } from './IRouteRequest';
import { IProxyRequest } from '../proxy/IProxyRequest';

export class RouteRequest implements IRouteRequest {

  public static WARN_ON_EMPTY_PARAMETER = true;

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

  protected _matchedPattern: string;

  get matchedPattern() {
    return this._matchedPattern;
  }

  constructor(
    adapter: string,
    url: string,
    matchedPattern: string
  ) {
    this._adapter = adapter;
    this._originalURL = this.normalizeURL(url);
    this._matchedPattern = matchedPattern;
    this.url = this._originalURL;
  }

  protected normalizeURL(url: string) {
    // trim url
    let normalized = url.trim();

    // Remove ending slash
    if (normalized.indexOf('/') === normalized.length - 1) {
      normalized = normalized.substring(0, -1);
    }

    // Add intial slash
    if (normalized[0] !== '/') {
      normalized = '/' + normalized;
    }

    return normalized;
  }

  protected _proxies: IProxyRequest[] = [];

  get appliedProxies(): IProxyRequest[] {
    return [...this._proxies];
  }

  set appliedProxies(proxies: IProxyRequest[]) {
    this._proxies = [
      ...this._proxies, // Currently applied proxies
      ...proxies.filter(p => !this._proxies.includes(p)) // Unique new proxies (?)
    ];
  }

  get(name: string, origin = RouteRequest.EMPTY_ORIGIN_NAME) {
    // Asking for a specific origin?
    if (origin != RouteRequest.EMPTY_ORIGIN_NAME) {
      if (this._parametersByOrigin[origin] != null) {
        return this._parametersByOrigin[origin][name] ?? undefined;
      }
      else {
        return undefined;
      }
    }
    if (
      this._allParameters[name] === undefined
      && RouteRequest.WARN_ON_EMPTY_PARAMETER
    ) {
      console.warn(`Parameter ${name} is undefined! Make sure to handle it properly!`);
    }
    // If not use 'all parameters'
    return this._allParameters[name];
  }

  has(name: string, origin = RouteRequest.EMPTY_ORIGIN_NAME): boolean {
    // Asking for a specific origin?
    if (origin != RouteRequest.EMPTY_ORIGIN_NAME) {
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

  setOrigin(name: string, value: any): void {
    this._allParameters[name] = value;
    this._parametersByOrigin[name] = value;
  }

  getOrigin<T = any>(name: string): T {
    return this._allParameters[name] as T;
  }

  add(name: string, value: any, from = RouteRequest.EMPTY_ORIGIN_NAME) {

    if (this._parametersByOrigin[from] == null) {
      this._parametersByOrigin[from] = {};
    }
    this._parametersByOrigin[from] = {
      ...this._parametersByOrigin[from],
      [name]: value
    };
    this._allParameters[name] = value;
  }

  remove(name: string, from = RouteRequest.EMPTY_ORIGIN_NAME) {
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
  get byOrigin(): ParametersByOrigin {
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