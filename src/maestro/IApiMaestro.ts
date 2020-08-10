import { ApiRequestHandler } from './ApiRequestHandler';
import { ApiCallResolver } from '../resolver/ApiCallResolver';
import { ValidateApiCallFunction } from '../validation/ValidateApiCallFunction';

export interface IApiMaestro {

  setCallResolver(resolver : ApiCallResolver) : void;
  
  setParameterValidation(validation : ValidateApiCallFunction) : void;
  
  setSchemaValidation(validation : ValidateApiCallFunction) : void;

  handle : ApiRequestHandler;

}