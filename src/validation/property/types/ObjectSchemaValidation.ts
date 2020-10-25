import { Maybe } from '../../../error/Maybe';
import { ObjectSchema } from '../../../route/schema/ObjectSchema';

export function ObjectSchemaValidation(
  schema: ObjectSchema,
  value: any
): Maybe<true> {
  return true;
}