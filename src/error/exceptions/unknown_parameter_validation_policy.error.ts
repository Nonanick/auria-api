import { ApiException } from '../api_exception.error';

export class UnknownParameterValidationPolicy extends ApiException {

  get code(): string {
    return 'API.VALIDATION_POLICY.UNKOWN_POLICY';
  }

}