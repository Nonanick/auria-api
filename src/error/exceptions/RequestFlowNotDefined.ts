import { ApiException } from '../ApiException';

export class RequestFlowNotDefined extends ApiException {

  get code(): string {
    return 'API.MAESTRO.REQUEST_FLOW_WAS_NOT_DEFINED';
  }

}