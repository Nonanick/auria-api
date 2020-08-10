import { ApiException } from '../ApiException';

export class UnknownParameterSchemaPolicy extends ApiException {

  get code(): string {
    return 'API.SCHEMA_POLICY.UNKOWN_POLICY';
  }

}