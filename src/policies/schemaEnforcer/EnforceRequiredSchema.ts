import { SchemaViolation } from '../../error/error/SchemaViolation';
import { RouteSchemaEnforcer } from '../../validation/policies/schema/RouteSchemaEnforcer';

export const EnforceRequiredSchema: RouteSchemaEnforcer =
  (route, request) => {

    // no schema, no validation
    if (route.schema == null) {
      return true;
    }

    for (let origin in route.schema) {
      let originSchema = route.schema[origin]!;
      let requiredProperties = originSchema.required ?? [];

      for (let required of requiredProperties) {
        if (!request.has(required, origin)) {
          return new SchemaViolation(
            'Required property ', required,
            ' expected in ', origin,
            ' is not present in the request!'
          );
        }
      }
    }

    return true;
  };