import ajv from 'ajv';

export const SchemaValidator = new ajv({
  coerceTypes: false,
  useDefaults: true,
  removeAdditional: true,
  allErrors: true,
  validateFormats : false,
  validateSchema : 'log',
});