import { BaseSchema } from './BaseSchema';

export interface NullSchema extends BaseSchema<null> {
  type: 'null';
}