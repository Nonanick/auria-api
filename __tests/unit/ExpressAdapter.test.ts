import { ExpressAdapter } from '../../src/adapter/express/ExpressAdapter';
import { ApiContainer } from '../../src/container/ApiContainer';
import { ApiController } from '../../src/controller/ApiController';
import { RegisterApiRoute } from '../../src/controller/RegisterApiRoute';
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

    @RegisterApiRoute({
      'url': 'test',
      methods: ['connect', 'delete', 'get', 'head', 'options', 'patch', 'put', 'trace', 'post', 'all']
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
    adapter.addApiContainer(container);
    adapter.start();

    expect(adapter.loadedRoutes()[''])
  });
});