export abstract class ApiException extends Error {
  
  abstract get code() : string;

}