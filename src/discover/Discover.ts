import { Maestro } from "../maestro/Maestro";
import { Container } from "../container/Container";
import { DiscoverApiController } from "./api/DiscoverApiController";
import { DiscoverClientController } from "./client/DiscoverClientController";
import { DiscoverOptions } from "./DiscoverOptions";

export class Discover extends Container {

  protected _baseURL: string = 'discover';

  get baseURL(): string {
    return this._baseURL;
  }

  constructor(
    protected _maestro: Maestro,
    options?: Partial<DiscoverOptions>
  ) {
    super();

    this.addRequestProxy({
      name: 'inject-maestro',
      apply: async (req) => {
        req.add('maestro', this._maestro, 'discover');
        return req;
      }
    });

    this.addController(
      new DiscoverApiController,
      new DiscoverClientController
    );
  }

}

declare module '../request/IRouteRequest' {
  interface IRouteRequest {
    get(name: 'maestro', from?: 'discover'): Maestro;
  }
}