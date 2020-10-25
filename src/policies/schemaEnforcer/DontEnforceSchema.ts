import { RouteSchemaEnforcer } from '../../validation/policies/schema/RouteSchemaEnforcer';

export const DontEnforceSchema: RouteSchemaEnforcer = (route, request) => {
  return true;
};