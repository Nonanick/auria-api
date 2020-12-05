import { Controller } from "../../controller/Controller";

export class DiscoverClientController extends Controller {

  get baseURL(): string {
    return 'client';
  }

}