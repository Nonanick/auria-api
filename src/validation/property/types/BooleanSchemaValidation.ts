import { Maybe } from '../../../error/Maybe';
import { BooleanSchema } from '../../../route/schema/BooleanSchema';

export function BooleanSchemaValidation(
  schema: BooleanSchema,
  value: any
): Maybe<true> {
  return true;
}