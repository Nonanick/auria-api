/**
 * # Schema Validation Policy
 * ---------------------------
 * Describe how errors in property validation should be handled:
 * 
 * ### * Prevent Execution (prevent-execution)
 * --------------------------------------------
 *
 * Passing an invalid parameter will prevent
 * the route from being called, an error will be
 * thrown and displayed to the API consumer
 *
 * Only properties described in the schema
 * can/will be validated, additional properties
 * allowed by an 'enforce-required' or 'dont-enforce'
 * schema policies must be treated by the route resolver
 * 
 * 
 * ### * Destroy Property (destroy-property)
 * ------------------------------------------
 *
 * Invalid properties are destroyed/removed from the request
 * If the destroyed property is marked as 'required' the API call will
 * halt and display the validation error
 * 
 * ### * No operation (no-op)
 * ---------------------------
 * Invalid properties have no side effects on the API call
 * cycle, no errors are displayed
 * 
 */
export type FailedPropertyValidationPolicy =
  | 'prevent-execution'
  | 'destroy-property'
  | 'no-op';