import { BaseSchema } from './BaseSchema';

export interface StringSchema extends BaseSchema<String> {
  type: 'string';
}