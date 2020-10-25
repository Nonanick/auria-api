import { ArraySchema } from './ArraySchema';
import { BaseSchema } from './BaseSchema';
import { BooleanSchema } from './BooleanSchema';
import { NullSchema } from './NullSchema';
import { NumberSchema } from './NumberSchema';
import { StringSchema } from './StringSchema';

export interface ObjectSchema<T = any> extends BaseSchema<T> {
  type: 'object',
  properties: {
    [name: string]: ObjectSchema | ArraySchema | NumberSchema | StringSchema | BooleanSchema | NullSchema;
  },
  definitions?: [],
  required?: string[],
}