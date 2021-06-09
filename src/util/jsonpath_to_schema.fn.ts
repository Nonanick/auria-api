import { JSONSchema, ObjectSchema } from '../route';

/**
 * Add JSON Path to Schema
 * --------------------------------
 * 
 * Add a JSONPath notation to the current schema!
 * 
 * Example:
 * $.prop[].name
 * 
 * will create :
 * 
 * {
 *  type : 'object',
 *  properties : {
 *    prop : {
 *      type : 'array',
 *      items : {
 *        type : 'object',
 *        properties : {
 *          name : { ...schemaFromArguments }
 *        }
 *      }
 *    }
 *  }
 * }
 * 
 * @TODO Handle "*" properly
 * 
 * @param jsonPath 
 * @param rootSchema 
 * @returns 
 */
 export function AddJsonPathToSchema(
  rootSchema : ObjectSchema, 
  jsonPath: string, 
  propertySchema: JSONSchema, 
  isRequired: boolean
):  JSONSchema {

  // If defining the root object, just reassign the schema
  if (jsonPath === '') {
    return {
      ...rootSchema as any,
      ...propertySchema,
    }
  }

  const pieces = jsonPath.split('.');

  let currentSchema = rootSchema;

  pieces.forEach((pathPiece, i) => {
    const pieceName = pathPiece.replace(/\[(?<expression>.*)?\]$/, '');
    let isArray = pieceName.length !== pathPiece.length;
    let isLastOfPath = i === pieces.length - 1;

    if (isRequired) { 
      if(!Array.isArray(currentSchema.required)) { 
        currentSchema.required = [];
      }
      currentSchema.required!.push(pieceName);
    }

    if (isArray) {
      currentSchema.properties![pieceName] = {
        type: 'array',
        items: isLastOfPath ? propertySchema : {
          type: 'object',
          properties: {},
          required: [],
          additionalProperties: false,
        }
      }
      currentSchema = (currentSchema.properties![pieceName] as any).items;
    } else {
      currentSchema.properties![pieceName] = isLastOfPath ? propertySchema : {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      };
      currentSchema = (currentSchema.properties![pieceName] as any);
    }

  });

  return rootSchema;

}
