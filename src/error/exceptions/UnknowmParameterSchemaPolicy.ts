import { ApiException } from '../ApiException';

export class UnkownParameterSchemaPolicy extends ApiException {

  get code(): string {
    return 'API.SCHEMA_POLICY.UNKOWN_POLICY';
  }

}