import { JSONSchema7Object } from 'json-schema';

export interface RouteSchema {
  body?: JSONSchema7Object;
  query?: JSONSchema7Object;
  params?: JSONSchema7Object;
  [name: string]: JSONSchema7Object | undefined;
}
