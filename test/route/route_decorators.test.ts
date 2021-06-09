import { expect } from 'chai';
import { Class } from 'type-fest';
import { Controller } from '../../dist/controller/controller.class';
import { GET, POST, DELETE, PATCH, PUT, SEARCH, Route } from '../../dist/controller/route.decorator';
import { FromBody } from '../../dist/route/argument_injectors/from_body.decorator';

describe('Route Decorators', () => {

  let controller: Controller;
  let controllerClass: Class<Controller>;

  beforeEach(() => {

    controller = new class extends Controller {
      baseURL = '';
    };

    controllerClass = class extends Controller {
      baseURL = '';
      public resolveRoute() {

      }
    }
  });

  it('Should add a route with "Route" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    Route({
      url: 'mock',
      methods: 'get'
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
  });

  it('Should add a route with "GET" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    GET({
      url: 'mock',
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
    expect(nCtrl.allRoutes()[0].methods).to.be.eq('get');
  });

  it('Should add a route with "POST" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    POST({
      url: 'mock',
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
    expect(nCtrl.allRoutes()[0].methods).to.be.eq('post');

  });

  it('Should add a route with "DELETE" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    DELETE({
      url: 'mock',
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
    expect(nCtrl.allRoutes()[0].methods).to.be.eq('delete');

  });

  it('Should add a route with "PUT" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    PUT({
      url: 'mock',
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
    expect(nCtrl.allRoutes()[0].methods).to.be.eq('put');

  });

  it('Should add a route with "PATCH" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    PATCH({
      url: 'mock',
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
    expect(nCtrl.allRoutes()[0].methods).to.be.eq('patch');

  });

  it('Should add a route with "SEARCH" decorator', () => {

    // Apply decorator the ugly way... why typescript, why...
    SEARCH({
      url: 'mock',
    })(
      controllerClass.prototype,
      'resolveRoute'
    );

    let nCtrl = new controllerClass();

    expect(nCtrl.allRoutes().length).to.be.eq(1);
    expect(nCtrl.allRoutes()[0].methods).to.be.eq('search');

  });

});
