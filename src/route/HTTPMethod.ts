export type HTTPMethod =
  | "get" // Fetches a representation of a resource
  | "search"
  | "put" // Mutation in state (update)
  | "post" // Mutation in state (creation)
  | "delete" // Asks for a resource to be removed
  | "options" // Describe communication options
  | "head" // No body required
  | "connect" //establishes a tunnel
  | "trace" // Loop-Back request
  | "patch" // Partial mutation (update)
  | "all" // Match all of the above
  ;