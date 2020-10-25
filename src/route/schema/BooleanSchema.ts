import { BaseSchema } from './BaseSchema';

export interface BooleanSchema extends BaseSchema<Boolean> {
  type: 'boolean';
}