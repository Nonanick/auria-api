export interface ICommand {
  adapters?: string | string[];
  name: string;
  payload: any;
}