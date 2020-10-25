import { BaseSchema } from './BaseSchema';

export interface NumberSchema extends BaseSchema<Number> {
  type: 'number';
  minimum?: number;
  maximum?: number;
}