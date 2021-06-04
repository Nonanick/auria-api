import { Maestro } from '../../dist/maestro/Maestro';
import { expect } from 'chai';
import { Container } from '../../dist/container/Container';
import { Controller } from '../../dist/controller/Controller';
import { IAdapter } from '../../dist/adapter/IAdapter';
import { MockedAdapter } from '../mock/adapter/MockedAdapter';

describe('Maestro', () => {

  let maestro : Maestro;
  
  beforeEach(() => {
    maestro = new Maestro();
  });

  it('Is created empty', () => {
   
    expect(maestro.allRoutes().length).eq(0);
    expect(maestro.containers().length).eq(0);
    expect(maestro.controllers().length).eq(0);

  });

  it('Add containers', () => {
    const container : Container = new class extends Container {
      baseURL = '';
    };

    maestro.add(container);
    expect(maestro.containers().length).eq(1);

  });

  it('Remove containers', () => {
    const container : Container = new class extends Container {
      baseURL = '';
    };

    maestro.add(container);
    expect(maestro.containers().length).eq(1);
    
    maestro.removeChildContainer(container);
    expect(maestro.containers().length).eq(0);
  });

  it('Add controllers', () => {

    const controller : Controller = new class extends Controller {
      baseURL = '';
    };

    maestro.add(controller);
    expect(maestro.controllers().length).eq(1);

  });

  it('Remove controllers', () => {

    const controller : Controller = new class extends Controller {
      baseURL = '';
    };

    maestro.add(controller);
    expect(maestro.controllers().length).eq(1);
    
    maestro.removeController(controller);
    expect(maestro.controllers().length).eq(0);
  });

  it('Add adapters', () => {

    const adapter : IAdapter = new MockedAdapter;

    maestro.addAdapter(adapter);

    expect(Object.values(maestro.adapters).length).eq(1);
  });

  it('Remove adapters', () => {
    const adapter : IAdapter = new MockedAdapter;

    maestro.addAdapter(adapter);
    expect(Object.values(maestro.adapters).length).eq(1);

    delete maestro.adapters[adapter.name];

    expect(Object.values(maestro.adapters).length).eq(0);

  });
});