import type { JSONSchema7 } from 'json-schema';
import { ObjectSchema } from './schema/custom_schemas';

export type RouteSchema = RequestSchema & ResponseSchema;

export interface RequestSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
  header? : ObjectSchema;
}
export interface ResponseSchema {
  response?: {
    [status: string]: JSONSchema7;
  };
}