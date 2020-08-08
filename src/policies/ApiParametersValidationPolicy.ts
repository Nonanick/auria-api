/**
 * Parameters Validation Policy
 * ---------------------------
 * Describe how optional parameters validation should be handled
 * 
 */
export type ApiParametersValidationPolicy = 
/**
 * Prevent Execution
 * -----------------
 * Passing an invalid parameter will prevent
 * the route from being called, an error will be
 * thrown and displayed to the API consumer
 */
| 'prevent-execution' 
/**
 * Ignore Parameter
 * -----------------
 * When a invalid optional parameter is passed
 * the parameter will be deleted and will never reach the route
 * 
 * This behaviour might be more swift to the api consumer
 * by not throwing errors but it can produce unexpected behaviour
 * If a required parameter fails validation and is 'ignored' the route
 * won't be called if the schema policy does not allow it!
 */
| 'ignore-parameter' 
/**
 * Dont validate
 * --------------
 * 
 * All parameters will be passed 'as is' to the route
 */
| 'dont-validate';