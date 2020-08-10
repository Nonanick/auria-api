import path from 'path';
import { IApiContainer } from './IApiContainer';
import { IApiController } from '../controller/IApiController';
import { IApiRequestProxy } from '../proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../proxy/IApiResponseProxy';
import { EventEmitter } from 'events';
import { IProxiedApiRoute } from '../proxy/IProxiedApiRoute';

export abstract class ApiContainer extends EventEmitter implements IApiContainer {

  protected _cachedRoutes?: IProxiedApiRoute[];

  protected _controllers: IApiController[] = [];

  protected _containers: IApiContainer[] = [];

  protected _requestProxies: IApiRequestProxy[] = [];

  protected _responseProxies: IApiResponseProxy[] = [];

  abstract get baseURL(): string;

  transformRoute(route: IProxiedApiRoute): IProxiedApiRoute {

    let nRoute: IProxiedApiRoute = {
      ...route,
      url: path.posix.join(this.baseURL, route.url),
      requestProxies: [...this.requestProxies(), ...route.requestProxies],
      responseProxies: [...this.responseProxies(), ...route.responseProxies]
    };

    return nRoute;
  }

  addController(controller: IApiController): IApiContainer {
    if (!this._controllers.includes(controller)) {
      this._controllers.push(controller);
    }
    return this;
  }

  removeController(controller: IApiController): IApiContainer {
    let ioController = this._controllers.indexOf(controller);
    if (ioController >= 0) {
      this._controllers.splice(ioController, 1);
    }
    return this;
  }

  controllers(): IApiController[] {
    return [...this._controllers];
  }

  childContainers(): IApiContainer[] {
    return [...this._containers];
  }

  addChildContainer(container: IApiContainer): IApiContainer {
    if (!this._containers.includes(container)) {
      this._containers.push(container);
    }
    return this;
  }

  removeChildContainer(container: IApiContainer): IApiContainer {
    let ioContainer = this._containers.indexOf(container);
    if (ioContainer >= 0) {
      this._containers.splice(ioContainer, 1);
    }
    return this;
  }

  requestProxies(): IApiRequestProxy[] {
    return [...this._requestProxies];
  }

  addRequestProxy(proxy: IApiRequestProxy): IApiContainer {
    if (!this._requestProxies.includes(proxy)) {
      this._requestProxies.push(proxy);
    }
    return this;
  }

  removeRequestProxy(proxy: IApiRequestProxy): IApiContainer {
    let ioProxy = this._requestProxies.indexOf(proxy);
    if (ioProxy >= 0) {
      this._requestProxies.splice(ioProxy, 1);
    }
    return this;
  }

  responseProxies(): IApiResponseProxy[] {
    return [...this._responseProxies];
  }

  addResponseProxy(proxy: IApiResponseProxy): IApiContainer {
    if (!this._responseProxies.includes(proxy)) {
      this._responseProxies.push(proxy);
    }
    return this;
  }

  removeResponseProxy(proxy: IApiResponseProxy): IApiContainer {
    let ioProxy = this._responseProxies.indexOf(proxy);
    if (ioProxy >= 0) {
      this._responseProxies.splice(ioProxy, 1);
    }
    return this;
  }

  allRoutes(): IProxiedApiRoute[] {

    if (this._cachedRoutes != null) {
      return this._cachedRoutes;
    }

    let childContainerRoutes = this._containers.map(c => c.allRoutes());
    let controllerRoutes = this._controllers.map(c => c.allRoutes());

    let allRoutes: IProxiedApiRoute[] = [];

    allRoutes = allRoutes.concat(...controllerRoutes);
    allRoutes = allRoutes.concat(...childContainerRoutes);

    this._cachedRoutes = allRoutes.map(r => {
      return { ...this.transformRoute(r) };
    });

    // Add Base URL to route URL's
    return [...this._cachedRoutes];
  }

  deleteCacheRoutes() {
    this.childContainers().forEach(
      (c) => {
        if (c instanceof ApiContainer)
          c.deleteCacheRoutes();
      }
    );
    delete this._cachedRoutes;
  }

}