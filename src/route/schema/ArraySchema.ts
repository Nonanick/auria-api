import { BaseSchema } from './BaseSchema';
import { BooleanSchema } from './BooleanSchema';
import { NullSchema } from './NullSchema';
import { NumberSchema } from './NumberSchema';
import { ObjectSchema } from './ObjectSchema';
import { StringSchema } from './StringSchema';

export interface ArraySchema extends BaseSchema {
  type: 'array',

  items: ObjectSchema | ArraySchema | NumberSchema | StringSchema | BooleanSchema | NullSchema;

  minLength?: number;

  maxLength?: number;

}