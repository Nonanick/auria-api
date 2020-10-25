import { SchemaViolation } from '../../error/error/SchemaViolation';
import { RouteSchemaEnforcer } from '../../validation/policies/schema/RouteSchemaEnforcer';

export const EnforceStrictSchema: RouteSchemaEnforcer =
  (route, request) => {

    let allParameters = request.parametersByOrigin ?? {};

    // Check if everything present in the request is described
    for (let origin in allParameters) {

      let originSchema = route.schema?.[origin];
      if (originSchema == null) {
        return new SchemaViolation(
          'Source ', origin,
          ' is present in the request but not described in the schema!'
        );
      }

      for (let parameter in allParameters[origin]) {
        let parameterSchema = originSchema.properties[parameter];
        if (parameterSchema == null) {
          return new SchemaViolation(
            'Parameter ', parameter,
            ' present in "', origin,
            '" is not described in the schema!'
          );
        }
      }
    }

    // Check for required parameters!

    // -- No schema and no non-described parameters == passed!
    if (route.schema == null) {
      return true;
    }

    // Check each required parameter
    for (let origin in route.schema) {
      let originSchema = route.schema[origin]!;
      for (let required in originSchema.required ?? []) {
        if (!request.hasParameter(required, origin)) {
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