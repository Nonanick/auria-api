import { EventEmitter } from "events";
import { IApiAdapter } from "../../src/adapter/IApiAdapter";
import { IApiContainer } from "../../src/container/IApiContainer";
import { ApiSendErrorFunction } from "../../src/maestro/ApiSendErrorFunction";
import { ApiSendResponseFunction } from "../../src/maestro/ApiSendResponseFunction";
import { IProxiedApiRoute } from "../../src/proxy/IProxiedApiRoute";
import { ApiRouteRequest } from "../../src/request/ApiRouteRequest";
import { IApiRouteRequest } from "../../src/request/IApiRouteRequest";
import { IApiRouteResponse } from "../../src/response/IApiRouteResponse";
import { MockedRouteHandler } from "./MockedRouteHandler";

export class MockedAdapter extends EventEmitter implements IApiAdapter {

  protected _containers: IApiContainer[] = [];

  protected _handler: (route: IProxiedApiRoute, request: IApiRouteRequest, sendResponse: ApiSendResponseFunction, sendError: ApiSendErrorFunction) => Promise<void> = MockedRouteHandler;

  get name(): string {
    return 'MockedAdapter';
  }

  addApiContainer(container: IApiContainer): void {
    this._containers.push(container);
  }

  setRequestHandler(handler: (route: IProxiedApiRoute, request: IApiRouteRequest, sendResponse: ApiSendResponseFunction, sendError: ApiSendErrorFunction) => Promise<void>): void {
    this._handler = handler;
  }

  async request(url: string, schema: any): Promise<IApiRouteResponse> {
    let req = new ApiRouteRequest(this.name, url);
    req.identification = 'UserMockedRequest';
    req.method = 'all';

    return new Promise((resolve, reject) => {
      //this._handler()
    });
  }

  start(): void {
    return;
  }


}