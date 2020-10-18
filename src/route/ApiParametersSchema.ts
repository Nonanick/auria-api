import { Maybe } from '../error/Maybe';

export interface ApiParametersSchema {
  body?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
  [name: string]: ObjectSchema | undefined;
}

interface BaseSchema<T = any> {
  cast: (value: any) => T;
  validate: (value: any) => Maybe<true>;
}

export interface ObjectSchema<T = any> extends BaseSchema<T> {
  type: 'object',
  properties: {
    [name: string]: ObjectSchema | ArraySchema | NumberSchema | StringSchema | BooleanSchema;
  },
  definitions?: [],
  required?: string[],
}

export interface ArraySchema {
  type: 'array',
  items: ObjectSchema | ArraySchema | NumberSchema | StringSchema | BooleanSchema;
}

export interface NumberSchema {
  type: 'number';
  minimum?: number;
  maximum?: number;
}

export interface StringSchema {
  type: 'string';
}

export interface BooleanSchema {
  type: 'boolean';
}

export interface NullSchema {
  type: 'null';
}