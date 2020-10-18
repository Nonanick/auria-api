import { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from 'fastify-cookie';

export const FastifyCommands = {

  // Set Header - Command
  'setHeader': (response: FastifyReply, headers: FastifyCommandSetHeaderPayload) => {
    for (let headerName in headers) {
      response.header(headerName, headers[headerName]);
    }
  },

  // Set Cookie - Command
  'setCookie': (response: FastifyReply, cookies: FastifyCommandSetCookiePayload) => {
    for (let cookieName in cookies) {
      response.setCookie(cookieName, cookies[cookieName].value, cookies[cookieName]);
    }
  }
};

export type KnownFastifyCommands = keyof typeof FastifyCommands;

export type FastifyCommandSetHeaderPayload = {
  [name: string]: string;
};

export type FastifyCommandSetCookiePayload = {
  [cookieName: string]: CookieSerializeOptions & { value: string; };
};