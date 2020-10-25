import { Maybe } from '../../../error/Maybe';
import { NullSchema } from '../../../route/schema/NullSchema';

export function NullSchemaValidation(
  schema: NullSchema,
  value: any
): Maybe<true> {
  return true;
}