import { IApiRequestProxy } from '../../src/proxy/IApiRequestProxy';
import { ApiError } from '../../src/error/ApiError';
import { ApiException } from '../../src/error/ApiException';

describe('Api Error', () => {

  class TestError extends ApiError {
    get httpStatus(): number {
      return 401;
    }
  }

  class TestException extends ApiException {

    code = 'JEST.ERROR';

  }

  it('should generate appropriate errors on proxy', () => {
    let errorProxy : IApiRequestProxy = {
      name : 'test',
      apply(r) {
        throw new TestError('Testing', {
          code : 'JEST.TEST',
          title : 'Testing purpose',
          reason : 'I need to test',
          hint : 'You should not test if you want to avoid this error',
          example : 'Dont run yarn test!'
        });
      }
    };

    expect(errorProxy.apply).toThrow(/^Testing/);
  });

  it('should generate appropriate exceptions on proxy', () => {
    let errorProxy : IApiRequestProxy = {
      name : 'test',
      apply(r) {
        throw new TestException('Testing');
      }
    };

    expect(errorProxy.apply).toThrow(/^Testing/);
  });

});