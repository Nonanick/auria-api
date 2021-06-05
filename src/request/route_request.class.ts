import { IRouteRequest } from "./route_request.type";
import { IProxyRequest } from "../proxy/proxy_request.type";

export class RouteRequest implements IRouteRequest {
  public static WARN_ON_EMPTY_PARAMETER = true;

  private static EMPTY_ORIGIN_NAME = "_";

  private static DEBUG_REQUEST_LIFECYCLE =
    process.env.NODE_ENV === "development";

  protected _adapter: string;

  get adapter(): string {
    return this._adapter;
  }

  protected _timestamp = Date.now();

  get timestamp() {
    return this._timestamp;
  }

  protected _originalURL: string;

  protected _originalParameters?: {
    [name: string]: any;
  };

  setAsRaw() {
    this._originalParameters = { ...this.byOrigin };
  }

  get rawParameters(): any {
    return this._originalParameters ?? {};
  }

  get originalURL(): string {
    return this._originalURL;
  }

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
    matchedPattern: string,
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
    if (normalized.indexOf("/") === normalized.length - 1) {
      normalized = normalized.substring(0, -1);
    }

    // Add intial slash
    if (normalized[0] !== "/") {
      normalized = "/" + normalized;
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
      ...proxies.filter((p) => !this._proxies.includes(p)), // Unique new proxies (?)
    ];
  }

  get(name: string | string[], origin = RouteRequest.EMPTY_ORIGIN_NAME) {
    let returnValues: string[] = [];
    if (typeof name === "string") {
      returnValues = [name];
    } else {
      returnValues = name;
    }

    let returnObj: {
      [key in typeof name[number]]: any;
    } = {};

    for (let vName of returnValues) {
      
      if (this._parametersByOrigin[origin] != null) {
        returnObj[vName] = this._parametersByOrigin[origin][vName] ?? undefined;
      } else {
        returnObj[vName] = undefined;
      }

      if(returnObj[vName] === undefined && origin === RouteRequest.EMPTY_ORIGIN_NAME) {
        returnObj[vName] = this._allParameters[vName];
      }
    }

    if (typeof name === "string") {
      return returnObj[name];
    } else {
      return returnObj;
    }

  }

  has(name: string, origin = RouteRequest.EMPTY_ORIGIN_NAME): boolean {
    // Asking for a specific origin?
    if (origin != RouteRequest.EMPTY_ORIGIN_NAME) {
      if (this._parametersByOrigin[origin] != null) {
        return this._parametersByOrigin[origin][name] != null;
      } else {
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

  getOrigin<T = unknown>(name: string): T {
    return this._allParameters[name] as T;
  }

  add(name: string, value: any, from  : string) : void; 
  add(obj: {[name : string] : any}, from : string) : void; 
  add(nameOrObj: string | {[name : string] : any}, valueOrFrom: any, from = RouteRequest.EMPTY_ORIGIN_NAME) : void {
    
    if(typeof nameOrObj === "object") {

      if (this._parametersByOrigin[valueOrFrom] == null) {
        this._parametersByOrigin[valueOrFrom] = {};
      }
      this._parametersByOrigin[valueOrFrom] = {
        ...this._parametersByOrigin[valueOrFrom],
        ...nameOrObj,
      };
      this._allParameters = {
        ...this._allParameters,
        ...nameOrObj
      };
      return;
    }
    
    if (this._parametersByOrigin[from] == null) {
      this._parametersByOrigin[from] = {};
    }
    this._parametersByOrigin[from] = {
      ...this._parametersByOrigin[from],
      [nameOrObj]: valueOrFrom,
    };

    this._allParameters[nameOrObj] = valueOrFrom;
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
