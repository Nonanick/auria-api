import { Container } from "../container/Container";
import { DiscoverOptions } from "./DiscoverOptions";

export class Discover extends Container {

  protected _baseURL: string = 'discover';

  get baseURL(): string {
    return this._baseURL;
  }

  constructor(options?: Partial<DiscoverOptions>) {
    super();
  }

}