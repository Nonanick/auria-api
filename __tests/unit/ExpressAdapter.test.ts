import { ExpressAdapter } from '../../src/adapter/express/ExpressAdapter';
import { ApiContainer } from '../../src/container/ApiContainer';
import { ApiController } from '../../src/controller/ApiController';
import { Route } from '../../src/controller/RegisterApiRoute';
import { ApiRouteResolver } from '../../src/route/ApiRouteResolver';

describe('Express Adapter', () => {

  class TestAdapterContainer extends ApiContainer {
    get baseURL(): string {
      return 'cont';
    }

  }
  class TestAdapterController extends ApiController {
    get baseURL(): string {
      return 'ctrl';
    }

    @Route({
      'url': 'test',
      methods: 'all'
    })
    public default: ApiRouteResolver = (req) => {
      return 'default';
    };

  }

  let container = new TestAdapterContainer();
  let controller = new TestAdapterController();
  container.addController(controller);

  it('Static name of the adapter should match its instance counterpart', () => {
    let adapter = new ExpressAdapter();
    expect(adapter.name).toBe(ExpressAdapter.ADAPTER_NAME);
  });

  it('Should expose routes from added containers', () => {
    let adapter = new ExpressAdapter();
    adapter.onPort(3001);
    adapter.addApiContainer(container);
    adapter.start();
    expect(adapter.loadedRoutes()).toBeDefined();
    adapter.stop();
  });
});