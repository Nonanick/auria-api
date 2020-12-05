import type { JSONSchema7 } from 'json-schema';
import { ObjectSchema } from './schema/CustomSchemas';

export type RouteSchema = RequestSchema & ResponseSchema;

export interface RequestSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}
export interface ResponseSchema {
  response?: {
    [status: string]: JSONSchema7;
  };
}