export interface IApiCommand {
  adapters? : string | string[];
  name : string;
  payload : any;
}