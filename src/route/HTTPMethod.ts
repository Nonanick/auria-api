export type HTTPMethod =
  | "get" // Fetchs a representation of a resource
  | "put" // Mutation in state (update)
  | "post" // Mutation in state (creation)
  | "delete" // Asks for a resource to be removed
  | "options" // Describe communication options
  | "head" // No body required
  | "connect" //stabilshes a tunnel
  | "trace" // Loop-Back request
  | "patch" // Partial mutation (update)
  | "all" // Match all of the above
  ;