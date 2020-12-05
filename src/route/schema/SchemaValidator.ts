import ajv from 'ajv';

export const SchemaValidator = new ajv({
  async: true,
  coerceTypes: true,
  useDefaults: true,
  nullable: true,
  removeAdditional: true,
  allErrors: true
});