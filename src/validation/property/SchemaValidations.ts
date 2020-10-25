import { SchemaValidationFunction } from './SchemaValidationFunction';
import { ArraySchemaValidation } from './types/ArraySchemaValidation';
import { BooleanSchemaValidation } from './types/BooleanSchemaValidation';
import { NullSchemaValidation } from './types/NullSchemaValidation';
import { NumberSchemaValidation } from './types/NumberSchemaValidation';
import { ObjectSchemaValidation } from './types/ObjectSchemaValidation';
import { StringSchemaValidation } from './types/StringSchemaValidation';

type SchemaValidationFunctions = {
  array: SchemaValidationFunction;
  boolean: SchemaValidationFunction;
  null: SchemaValidationFunction;
  number: SchemaValidationFunction;
  object: SchemaValidationFunction;
  string: SchemaValidationFunction;
  [type: string]: SchemaValidationFunction;
};

export const SchemaValidations: SchemaValidationFunctions = {
  array: ArraySchemaValidation,
  boolean: BooleanSchemaValidation,
  null: NullSchemaValidation,
  number: NumberSchemaValidation,
  object: ObjectSchemaValidation,
  string: StringSchemaValidation,
};