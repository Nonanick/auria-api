import { ApiException } from '../api_exception.error';

export class UnknownParameterSchemaPolicy extends ApiException {

  get code(): string {
    return 'API.SCHEMA_POLICY.UNKOWN_POLICY';
  }

}