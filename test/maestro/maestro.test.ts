import { Maestro } from '../../dist/maestro/maestro.class';
import { expect } from 'chai';
import { Container } from '../../dist/container/container.class';
import { Controller } from '../../dist/controller/controller.class';
import type { IAdapter } from '../../dist/adapter/adapter.type';
import { MockedAdapter } from '../mock/adapter/MockedAdapter';
import type { IProxiedRoute } from '../../dist/proxy/proxied_route.type';

describe('Maestro', () => {

  let maestro: Maestro;
  let controller: Controller & { [name: string]: any; };
  let container: Container & { [name: string]: any; };

  beforeEach(() => {
    maestro = new Maestro();
    container = new class extends Container {
      baseURL = '';
      [name: string]: any;

    };
    controller = new class extends Controller {
      baseURL = '';
      [name: string]: any;
    };
  });

  it('Is created empty', () => {

    expect(maestro.allRoutes().length).eq(0);
    expect(maestro.containers().length).eq(0);
    expect(maestro.controllers().length).eq(0);

  });

  it('Add containers', () => {

    maestro.add(container);
    expect(maestro.containers().length).eq(1);

  });

  it('Remove containers', () => {

    maestro.add(container);
    expect(maestro.containers().length).eq(1);

    maestro.removeChildContainer(container);
    expect(maestro.containers().length).eq(0);
  });

  it('Add controllers', () => {

    maestro.add(controller);
    expect(maestro.controllers().length).eq(1);

  });

  it('Remove controllers', () => {

    maestro.add(controller);
    expect(maestro.controllers().length).eq(1);

    maestro.removeController(controller);
    expect(maestro.controllers().length).eq(0);
  });

  it('Add adapters', () => {

    const adapter: IAdapter = new MockedAdapter;

    maestro.addAdapter(adapter);

    expect(Object.values(maestro.adapters).length).eq(1);
  });

  it('Remove adapters', () => {
    const adapter: IAdapter = new MockedAdapter;

    maestro.addAdapter(adapter);
    expect(Object.values(maestro.adapters).length).eq(1);

    delete maestro.adapters[adapter.name];

    expect(Object.values(maestro.adapters).length).eq(0);

  });

  it('Inherit routes from container', () => {

    controller.resolve = () => { };
    container.allRoutes = () => {
      const routes: IProxiedRoute[] = [{
        url: 'mock',
        methods: 'get',
        controller,
        resolver: controller.resolve,
        requestProxies: [],
        responseProxies: []
      }];

      return routes;
    }

    maestro.use(container);

    expect(maestro.allRoutes().length).eq(1);
  });

  it('Inherit routes from controller', () => {

    controller.resolve = () => { };
    controller.allRoutes = () => {
      const routes: IProxiedRoute[] = [{
        url: 'mock',
        methods: 'get',
        controller,
        resolver: controller.resolve,
        requestProxies: [],
        responseProxies: []
      }];

      return routes;
    }

    // By inheriting from container
    it('indirectly from container', () => {
      container.addController(controller);
      maestro.use(container);
      expect(maestro.allRoutes().length).eq(1);
      maestro.removeChildContainer(container);
      maestro.deleteCachedRoutes();
    });

    // By directling adding it
    it('directly adding to maestro', () => {
      expect(maestro.allRoutes().length).eq(0);
      maestro.deleteCachedRoutes();
      maestro.use(controller);
      expect(maestro.allRoutes().length).eq(1);
    });

  });
});