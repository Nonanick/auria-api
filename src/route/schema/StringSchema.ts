import { BaseSchema } from './BaseSchema';

export interface StringSchema extends BaseSchema<String> {
  type: 'string';
  matches?: RegExp;
  minLength?: number;
  maxLength?: number;
  allowedChars?: string;
  prohibitedChars?: string;
}