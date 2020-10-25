import { Maybe } from "../../error/Maybe";

export interface BaseSchema<T = any> {
  type: string;
  cast: (value: any) => T;
  validate: (value: any) => Maybe<true>;
}