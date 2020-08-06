import { ApiContainer } from './container/ApiContainer';
import { TestController } from './TestController';
import { InheritController } from './InheritController';

let container = new class extends ApiContainer {
  get baseURL(): string {
    return 'cont';
  }
}();

let controller = new TestController();
let controller2 = new InheritController();

controller.allRoutes();
controller2.allRoutes();