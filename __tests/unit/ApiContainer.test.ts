import { ApiContainer } from '../../src/container/ApiContainer';
import { ApiController } from '../../src/controller/ApiController';
import { RegisterApiRoute } from '../../src/controller/RegisterApiRoute';
import { IApiRequestProxy } from '../../src/proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../../src/proxy/IApiResponseProxy';
import path from 'path';
import { IApiRoute } from '../../src/route/IApiRoute';

describe('ApiContainer', () => {

  class TestContainer extends ApiContainer {

    get baseURL(): string {
      return 'cont';
    }

  }

  class TestController extends ApiController {

    get baseURL(): string {
      return 'ctrl';
    }

    @RegisterApiRoute({
      url : 'test'
    })
    public route() {

    }
  }

  it('should add controllers without duplicates', () => {
    let cont = new TestContainer();
    let ctrl = new TestController();

    cont.addController(ctrl);
    cont.addController(ctrl);
    expect(cont.controllers().length).toBe(1);
    expect(cont.controllers()[0]).toBe(ctrl);
  });

  it('should remove controllers without failing when removeing twice', () => {
    let cont = new TestContainer();
    let ctrl = new TestController();

    cont.addController(ctrl);
    cont.removeController(ctrl);
    cont.removeController(ctrl);

    expect(cont.controllers().length).toBe(0);
    expect(cont.controllers()[0]).toBeUndefined();
  });

  it('should add child containers without duplicates', () => {
    let cont = new TestContainer();
    let childCont = new TestContainer();
    cont.addChildContainer(childCont);
    cont.addChildContainer(childCont);

    expect(cont.childContainers().length).toBe(1);
    expect(cont.childContainers()[0]).toBe(childCont);
  });

  it('should remove child containers without failing when removing twice', () => {
    let cont = new TestContainer();
    let childCont = new TestContainer();
    cont.addChildContainer(childCont);

    cont.removeChildContainer(childCont);
    cont.removeChildContainer(childCont);

    expect(cont.childContainers().length).toBe(0);
    expect(cont.childContainers()[0]).toBeUndefined();
  });

  it('should add request proxies without duplicates', () => {
    let cont = new TestContainer();

    let proxy : IApiRequestProxy = {
      name : 'proxy',
      apply(r) {
        return r;
      } 
    };
    cont.addRequestProxy(proxy);
    cont.addRequestProxy(proxy);

    expect(cont.requestProxies().length).toBe(1);
    expect(cont.requestProxies()[0]).toBe(proxy);

  });

  it('should remove request proxies without failling when removing twice', () => {
    let cont = new TestContainer();

    let proxy : IApiRequestProxy = {
      name : 'proxy',
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
    let cont = new TestContainer();

    let proxy : IApiResponseProxy = {
      name : 'proxy',
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
    let cont = new TestContainer();

    let proxy : IApiResponseProxy = {
      name : 'proxy',
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
    let t = new TestController();
    let cont = new TestContainer();
    let childContainer = new TestContainer();

    cont.addController(t);
    cont.addChildContainer(childContainer);
    childContainer.addController(t);

    expect(cont.allRoutes().length).toBe(2);
    cont.deleteCacheRoutes();
    
    let route : IApiRoute = {
      url : 'new',
      methods : 'get',
      resolver(r) {}
    };
    t.addApiRoute(route);

    expect(cont.allRoutes().length).toBe(4);
    expect(cont.allRoutes()[1].url).toBe(path.join('cont','ctrl','new'));
    expect(cont.allRoutes()[3].url).toBe(path.join('cont','cont','ctrl','new'));

  });


});