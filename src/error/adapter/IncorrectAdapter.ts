import { ApiException } from '../ApiException';

export class IncorrectAdapter extends ApiException {
  get code(): string {
    return 'MAESTRO.HTTP_SERVER_ADAPTER.INCORRECT_COMMAND_RESOLVER';
  }

}