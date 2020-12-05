import { ObjectSchema } from './schema/CustomSchemas';

export interface RouteSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
  [name: string]: ObjectSchema | undefined;
}
