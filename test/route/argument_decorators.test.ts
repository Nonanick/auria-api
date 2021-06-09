import { expect } from 'chai';
import { Class } from 'type-fest';
import { Controller } from '../../dist/controller/controller.class';
import { Route } from '../../dist/controller/route.decorator';
import { FromBody } from '../../dist/route/argument_injectors/from_body.decorator';

describe('Argument decorators', () => {
  let controllerClass: Class<Controller>;

  beforeEach(() => {

    type UserAccessToken = {
      username: string;
      password: string;
      access: string;
      refresh: string;
    }

    controllerClass = class extends Controller {
      baseURL = '';
      public resolveRoute(
        username: string,
        password: string
      ): UserAccessToken {
        return {
          username,
          password,
          access: 'access',
          refresh: 'refresh'
        };
      }
    }
  });

  it('Should modify schema', () => {

    Route({
      url: 'mock',
      schema: {
        body: {
          type: 'object',
          properties: {
            mock: {
              type: 'string'
            }
          }
        }
      }
    })(controllerClass.prototype, 'resolveRoute');

    FromBody({
      type: 'string',
      property: 'username',
    })(controllerClass.prototype, 'resolveRoute', 0);

    FromBody({
      type: 'string',
      property: 'password'
    })(controllerClass.prototype, 'resolveRoute', 1);

    FromBody({
      type: 'boolean',
      property: 'keep-signed-in',
      required: false,
    })(controllerClass.prototype, 'resolveRoute', 1);


    let ctrl = new controllerClass();

    expect(ctrl.allRoutes().length).to.be.eq(1);
    // Add props
    expect(
      ctrl.allRoutes()[0].schema!.body?.properties
    ).to.have.deep.keys(
      ['mock', 'username', 'password', 'keep-signed-in']
    );
    // mark required props
    expect(
      ctrl.allRoutes()[0].schema!.body?.required
    ).to.have.members(
      ['username', 'password']
    );
  });

  it('Should add injectors to function prototype', () => {

  });
});