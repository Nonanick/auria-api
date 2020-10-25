/**
 * Parameter Schema
 * -----------------
 * Describe how the route schema will be handled
 * 
 */
export type EnforceSchemaPolicy =
  /**
   * Don't Enforce
   * -----
   * Allow any parameter to be passed to the route
   * the lack of parameters marked as 'required' won't prevent 
   * the route from being called
   */
  | "dont-enforce"
  /**
   * Enforce Required
   * -----------------
   * Prevent the execution of the route is a parameter marked as 
   * "required" is not present in the route parameters
   */
  | "enforce-required"
  /**
   * Strict Schema
   * ----------------
   * [] Only allows parameters that are described as
   * required or optional to be passed in
   * 
   * [] Required parameters must be present!
   */
  | "strict-schema";