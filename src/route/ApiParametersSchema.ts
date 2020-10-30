import type { ObjectSchema } from './schema/ObjectSchema';

export interface ApiParametersSchema {
  body?: Omit<ObjectSchema, "type">;
  query?: Omit<ObjectSchema, "type">;
  params?: Omit<ObjectSchema, "type">;
  [name: string]: Omit<ObjectSchema, "type"> | undefined;
}
