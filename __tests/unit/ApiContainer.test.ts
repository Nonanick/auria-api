import path from 'path';
import { IApiRequestProxy } from '../../src/proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../../src/proxy/IApiResponseProxy';
import { IApiRoute } from '../../src/route/IApiRoute';
import { MockedApiContainer } from '../__mock__/MockedApiContainer';
import { MockedApiController } from '../__mock__/MockedApiController';

describe('ApiContainer', () => {


  it('should add controllers without duplicates', () => {
    let cont = new MockedApiContainer();
    let ctrl = new MockedApiController();

    cont.addController(ctrl);
    cont.addController(ctrl);
    expect(cont.controllers().length).toBe(1);
    expect(cont.controllers()[0]).toBe(ctrl);
  });

  it('should remove controllers without failing when removing twice', () => {
    let cont = new MockedApiContainer();
    let ctrl = new MockedApiController();

    cont.addController(ctrl);
    cont.removeController(ctrl);
    cont.removeController(ctrl);

    expect(cont.controllers().length).toBe(0);
    expect(cont.controllers()[0]).toBeUndefined();
  });

  it('should add child containers without duplicates', () => {
    let cont = new MockedApiContainer();
    let childCont = new MockedApiContainer();
    cont.addChildContainer(childCont);
    cont.addChildContainer(childCont);

    expect(cont.containers().length).toBe(1);
    expect(cont.containers()[0]).toBe(childCont);
  });

  it('should remove child containers without failing when removing twice', () => {
    let cont = new MockedApiContainer();
    let childCont = new MockedApiContainer();
    cont.addChildContainer(childCont);

    cont.removeChildContainer(childCont);
    cont.removeChildContainer(childCont);

    expect(cont.containers().length).toBe(0);
    expect(cont.containers()[0]).toBeUndefined();
  });

  it('should add request proxies without duplicates', () => {
    let cont = new MockedApiContainer();

    let proxy: IApiRequestProxy = {
      name: 'proxy',
      apply(r) {
        return r;
      }
    };
    cont.addRequestProxy(proxy);
    cont.addRequestProxy(proxy);

    expect(cont.requestProxies().length).toBe(1);
    expect(cont.requestProxies()[0]).toBe(proxy);

  });

  it('should remove request proxies without failing when removing twice', () => {
    let cont = new MockedApiContainer();

    let proxy: IApiRequestProxy = {
      name: 'proxy',
      apply(r) {
        return r;
      }
    };
    cont.addRequestProxy(proxy);

    cont.removeRequestProxy(proxy);
    cont.removeRequestProxy(proxy);

    expect(cont.requestProxies().length).toBe(0);
    expect(cont.requestProxies()[0]).toBeUndefined();
  });

  it('should add response proxies without duplicates', () => {
    let cont = new MockedApiContainer();

    let proxy: IApiResponseProxy = {
      name: 'proxy',
      apply(r) {
        return r;
      }
    };
    cont.addResponseProxy(proxy);
    cont.addResponseProxy(proxy);

    expect(cont.responseProxies().length).toBe(1);
    expect(cont.responseProxies()[0]).toBe(proxy);
  });

  it('should remove response proxies', () => {
    let cont = new MockedApiContainer();

    let proxy: IApiResponseProxy = {
      name: 'proxy',
      apply(r) {
        return r;
      }
    };
    cont.addResponseProxy(proxy);

    cont.removeResponseProxy(proxy);
    cont.removeResponseProxy(proxy);

    expect(cont.responseProxies().length).toBe(0);
    expect(cont.responseProxies()[0]).toBeUndefined();
  });

  it('should return routes from child containers and controllers', () => {
    let t = new MockedApiController();
    let cont = new MockedApiContainer();
    let childContainer = new MockedApiContainer();

    cont.addController(t);
    cont.addChildContainer(childContainer);
    childContainer.addController(t);

    expect(cont.allRoutes().length).toBe(2);
    cont.deleteCachedRoutes();

    let route: IApiRoute = {
      url: 'new',
      methods: 'get',
      resolver(r) { }
    };
    t.addApiRoute(route);

    expect(cont.allRoutes().length).toBe(4);
    expect(cont.allRoutes()[1].url).toBe(path.posix.join('container', 'controller', 'new'));
    expect(cont.allRoutes()[3].url).toBe(path.posix.join('container', 'container', 'controller', 'new'));

  });


});