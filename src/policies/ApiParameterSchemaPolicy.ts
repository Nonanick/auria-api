/**
 * Parameter Schema
 * -----------------
 * Policy for handling parameters inside a route
 * 
 */
export type ApiParameterSchemaPolicy = 
/**
 * None
 * -----
 * Allow any parameter to be passed, parameters
 * the lack of parameters marked as required won't prevent 
 * the route to be called
 */
| "none" 
/**
 * Enforce Required
 * -----------------
 * Prevent the execution of the route is a parameter marked as 
 * "required" is not present in the route parameters
 */
| "enforce-required"
/**
 * Only in Schema
 * ----------------
 * Only allows parameters that are described as
 * required or optional to be passed in
 */
| "only-in-schema";