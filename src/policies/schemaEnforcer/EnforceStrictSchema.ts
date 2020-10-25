import { RouteSchemaEnforcer } from '../../validation/policies/schema/RouteSchemaEnforcer';

export const EnforceStrictSchema: RouteSchemaEnforcer = (route, request) => {


  return true;
};