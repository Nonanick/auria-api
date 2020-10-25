import type { ObjectSchema } from './schema/ObjectSchema';

export interface ApiParametersSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
  [name: string]: ObjectSchema | undefined;
}
