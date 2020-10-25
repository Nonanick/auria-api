import { RouteSchemaEnforcer } from '../../validation/policies/schema/RouteSchemaEnforcer';

export const EnforceRequiredSchema: RouteSchemaEnforcer = (route, request) => {


  return true;
};