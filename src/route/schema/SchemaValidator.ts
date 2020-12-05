import ajv from 'ajv';

export const SchemaValidator = new ajv({
  async: true,
  coerceTypes: true,
  verbose: true,
});