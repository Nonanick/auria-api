import { Controller } from '../../dist/controller/Controller';
import { expect } from 'chai';
import { IProxiedRoute } from '../../dist/proxy/IProxiedRoute';

describe('Controller', () => {

  let controller: Controller & {[name : string] : any};
  let newRoute : IProxiedRoute;
  
  beforeEach(() => {
    controller = new class extends Controller {
      baseURL = '';
      resolve() {}
    };
    newRoute = {
      url : 'mock',
      methods : 'get',
      requestProxies : [],
      responseProxies : [],
      controller,
      resolver : controller.resolve
    };
  });

  it('should be created empty', () => {

    expect(controller.allRoutes().length).eq(0);
    expect(controller.requestProxies().length).eq(0);
    expect(controller.responseProxies().length).eq(0);

  });

  it('should hold routes', () => {

    controller.addApiRoute(newRoute);

    expect(controller.allRoutes().length).eq(1);
    expect(controller.allRoutes()[0]).to.deep.equal(newRoute);

  });

  it('should remove routes', () => {
    controller.addApiRoute(newRoute);

    controller.removeApiRoute(newRoute.url);
    expect(controller.allRoutes().length).eq(0);
  });

  it('should transform routes', () => {

    controller.transformRoute = r => {
      return {
        ...r,
        url : 'ctrl/' + r.url,
        responseProxies : [
          { name : 'mocked', apply : r => r }
        ],
        requestProxies : [
          { name : 'mocked', apply : r => r }
        ]
      }
    };

    controller.addApiRoute(newRoute);
    expect(controller.allRoutes().length).eq(1);
    expect(controller.allRoutes()[0]).to.not.deep.equal(newRoute);

    it('should change URL', () => {
      expect(controller.allRoutes()[0].url).to.be.equal('ctrl/' + newRoute.url);
    });

    it('should change proxies', () => {
      expect(controller.allRoutes()[0].requestProxies.length).to.be.equal(1);
      expect(controller.allRoutes()[0].responseProxies.length).to.be.equal(1);
    });

  });
});