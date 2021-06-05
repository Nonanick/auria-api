import { ApiException } from '../api_exception.error';

export class SchemaEnforcedPolicyNotImplemented extends ApiException {
  get code(): string {
    return 'MAESTRO.SCHEMA_POLICY.NOT_IMPLEMENTED';
  }

}