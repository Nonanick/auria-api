import { ApiException } from '../api_exception.error';

export class RequestFlowNotDefined extends ApiException {

  get code(): string {
    return 'API.MAESTRO.REQUEST_FLOW_WAS_NOT_DEFINED';
  }

}