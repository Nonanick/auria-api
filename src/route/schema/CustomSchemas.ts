import { JSONSchema7 } from "json-schema";

export type JSONSchema = ObjectSchema | StringSchema | NumberSchema | ArraySchema;

export type BaseSchema = Pick<JSONSchema7,
  | "title"
  | "description"
  | "$comment"
  | "$id"
  | "$ref"
  // Any Type
  | "enum"
  | "const"
  | "default"
  // Subschema
  | "if"
  | "then"
  | "else"
  | "allOf"
  | "anyOf"
  | "oneOf"
  | "not"
>;
export type ObjectSchema = Pick<JSONSchema7,
  // For Objects
  | "maxProperties"
  | "minProperties"
  | "required"
  | "properties"
  | "patternProperties"
  | "dependencies"
  | "additionalProperties"
  | "propertyNames"

> & BaseSchema & { type: "object" | ["object"]; };

export type StringSchema = Pick<
  JSONSchema7,

  // For Strings
  | "maxLength"
  | "minLength"
  | "pattern"

> & BaseSchema & {
  type: "string" | ["string"];
};

export type NumberSchema = Pick<
  JSONSchema7,
  // For 
  | "multipleOf"
  | "maximum"
  | "minimum"
  | "exclusiveMaximum"
  | "exclusiveMinimum"
> & BaseSchema & {
  type: "number" | "integer" | [("number" | "integer")];
};


export type ArraySchema = Pick<
  JSONSchema7,
  // For Array
  | "items"
  | "additionalItems"
  | "maxItems"
  | "minItems"
  | "uniqueItems"
  | "contains"

> & BaseSchema & {
  type: "array" | ["array"];
};

export type BooleanSchema = BaseSchema & {
  type: "boolean" | ["boolean"];
  default?: boolean;
};
