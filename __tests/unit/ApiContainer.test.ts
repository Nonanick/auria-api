import { ApiContainer } from '../../src/container/ApiContainer';
import { ApiController } from '../../src/controller/ApiController';
import { RegisterApiRoute } from '../../src/controller/RegisterApiRoute';

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

  it('should add controllers', () => {
    let cont = new TestContainer();
    let ctrl = new TestController();
  });

  it('should remove controllers', () => {

  });

  it('should add child containers', () => {

  });

  it('should remove child containers', () => {

  });

  it('should add request proxies', () => {

  });

  it('should remove request proxies', () => {

  });

  it('should add response proxies', () => {

  });

  it('should remove response proxies', () => {

  });

  it('should return routes from child containers and controllers', () => {

  });


});