import { ApiController } from "../../src/controller/ApiController";

export class MockedApiController extends ApiController {

  get baseURL(): string {
    return 'controller';
  }


}