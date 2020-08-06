import { ApiController } from '../../src/controller/ApiController';
import { IApiRouteRequest } from '../../src/request/IApiRouteRequest';
import { RegisterApiRoute } from '../../src/controller/RegisterApiRoute';
import { ApiControllerDefaultRouteConfig } from '../../src/controller/ApiControllerDefaultRouteConfig';
import { IApiRequestProxy } from '../../src/proxy/IApiRequestProxy';
import { IApiResponseProxy } from '../../src/proxy/IApiResponseProxy';
import { IApiRouteResponse } from '../../src/response/IApiRouteResponse';

const TestBaseURL = 'test';

describe('ApiController', () => {
  class TestController extends ApiController {

    get defaultRouteConfig(): ApiControllerDefaultRouteConfig {
      return {
        parameterSchemaPolicy: "enforce-required"
      }
    }

    get baseURL(): string {
      return TestBaseURL;
    }

    @RegisterApiRoute({
      url: 'test',
      methods: ['get']
    })
    public testRouteWithDecorators(req: IApiRouteRequest) {

    }
  }

  it('should empty object when not overriden', () => {
    let t = new class extends ApiController {
      get baseURL(): string {
        return 'anon';
      }
    }();

    expect(t.defaultRouteConfig).not.toBeNull();
    expect(t.allRoutes().length).toBe(0);
  });

  it('should return proper baseURL', () => {
    let t = new TestController();
    expect(t.baseURL).toBe(TestBaseURL);
  });

  it('should retain custom default route config', () => {
    let t = new TestController();
    expect(t.defaultRouteConfig.parameterSchemaPolicy).toBe("enforce-required");
  });

  it('should understand decorated property as route', () => {

    let t = new TestController();
    expect(t.allRoutes().length).toBe(1);

  });

  it('should inherit default route config', () => {

    let t = new TestController();
    expect(t.allRoutes()[0].parameterSchemaPolicy).toBe("enforce-required");

  });

  it('should be able to add new routes dynamically', () => {
    let t = new TestController();

    t.addApiRoute({
      url: 'dynamic',
      methods: 'get',
      resolver: (req: IApiRouteRequest) => { }
    });

    expect(t.allRoutes().length).toBe(2);
    expect(t.allRoutes()[1].url).toBe('test\\dynamic');

  });

  it('should yield request proxies and not allow duplicates', () => {
    let t = new TestController();

    let proxy: IApiRequestProxy = {
      name: 'test',
      apply: (r: IApiRouteRequest) => r
    };

    t.addRequestProxy(proxy);
    t.addRequestProxy(proxy);
    let allRoutes = t.allRoutes();
    expect(allRoutes[0].requestProxies[0]).toBe(proxy);
    expect(allRoutes[0].requestProxies.length).toBe(1);

  });

  it('should remove request proxies', () => {
    let t = new TestController();

    let proxy: IApiRequestProxy = {
      name: 'test',
      apply: (r: IApiRouteRequest) => r
    };

    t.addRequestProxy(proxy);
    t.removeRequestProxy(proxy);
    t.removeRequestProxy(proxy)
    let allRoutes = t.allRoutes();
    expect(allRoutes[0].requestProxies.length).toBe(0);

  });

  it('should yield response proxies and not allow duplicates', () => {
    let t = new TestController();

    let proxy: IApiResponseProxy = {
      name: 'test',
      apply: (r: IApiRouteResponse) => r
    };

    t.addResponseProxy(proxy);
    t.addResponseProxy(proxy);
    let allRoutes = t.allRoutes();
    expect(allRoutes[0].responseProxies[0]).toBe(proxy);
    expect(allRoutes[0].responseProxies.length).toBe(1);

  });

  it('should remove response proxies', () => {
    let t = new TestController();

    let proxy: IApiResponseProxy = {
      name: 'test',
      apply: (r: IApiRouteResponse) => r
    };

    t.addResponseProxy(proxy);
    t.removeResponseProxy(proxy);
    t.removeResponseProxy(proxy);
    let allRoutes = t.allRoutes();
    expect(allRoutes[0].requestProxies.length).toBe(0);

  });
});

