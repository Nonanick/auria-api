import { Maybe } from '../../../error/Maybe';
import { ArraySchema } from '../../../route/schema/ArraySchema';

export function ArraySchemaValidation(
  schema: ArraySchema,
  value: any
): Maybe<true> {
  return true;
}