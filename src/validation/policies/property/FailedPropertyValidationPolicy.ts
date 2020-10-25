/**
 * Schema Validation Policy
 * ---------------------------
 * Describe how errors in property validation should be handled
 * 
 */
export type FailedPropertyValidationPolicy =
  /**
   * Prevent Execution
   * -----------------
   * 
   * Passing an invalid parameter will prevent
   * the route from being called, an error will be
   * thrown and displayed to the API consumer
   * 
   * Only properties described in the schema
   * can/will be validated, additional properties
   * allowed by an 'enforce-required' or 'dont-enforce'
   * schema policies must be treated by the route resolver
   */
  | 'prevent-execution'
  /**
   * Destroy Property
   * -----------------
   * 
   * Invalid properties are destroyed/removed from the request
   * If this property is marked as 'required' the API will
   * halt displaying the error
   */
  | 'destroy-property'
  /**
   * Dont validate
   * --------------
   * Properties won't be validated
   */
  | 'dont-validate';