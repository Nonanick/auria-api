import { ApiContainer } from "../../src/container/ApiContainer";
import { Route } from "../../src/controller/RegisterApiRoute";
import { ApiRouteResolver } from "../../src/route/ApiRouteResolver";

export class MockedApiContainer extends ApiContainer {

  get baseURL(): string {
    return 'container';
  }

  @Route({
    url: 'say-hi',
    methods: 'all',
  })
  public sayHi: ApiRouteResolver = (request) => {
    return 'hi';
  }


}