import pino, { Logger as PinoLogger, LoggerOptions as PinoOptions } from 'pino';
import { spawn, ChildProcess } from 'child_process';
import stream from 'stream';
import path from 'path';
import fs from 'fs';
class Logger {

  #raw: PinoLogger;

  public trace: PinoLogger['trace'];

  public info: PinoLogger['info'];

  public warn: PinoLogger['warn'];

  public error: PinoLogger['error'];

  public debug: PinoLogger['debug'];

  public fatal: PinoLogger['fatal'];

  public child: PinoLogger['child'];

  #childLogger: ChildProcess;

  constructor(options?: LoggerOptions) {

    const logThrough = new stream.PassThrough();

    const today = new Date();
    const dateAsStr = `[${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}]`;

    const logDir = path.resolve(
      process.cwd(),
      options?.path ?? 'logs'
    );

    fs.mkdirSync(logDir, { recursive: true });

    const logPath = path.join(
      logDir,
      dateAsStr + ' - ' + (process.env.NODE_ENV === 'development'
        ? 'dev.app'
        : 'app'),
    );

    this.#childLogger = spawn(
      process.execPath,
      [
        require.resolve('pino-tee'),
        process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        logPath + '.log',
        'warn', logPath + ' - WARN.log',
        'error', logPath + ' - ERROR.log',
        'fatal', logPath + ' - FATAL.log',
      ], { cwd: process.cwd(), env: process.env }
    );

    this.#raw = pino({
      name: 'maestro-logger',
      ...options
    }, logThrough);

    logThrough.pipe(this.#childLogger.stdin!);

    this.trace = this.#raw.trace.bind(this.#raw);
    this.info = this.#raw.info.bind(this.#raw);
    this.debug = this.#raw.debug.bind(this.#raw);
    this.warn = this.#raw.warn.bind(this.#raw);
    this.error = this.#raw.error.bind(this.#raw);
    this.fatal = this.#raw.fatal.bind(this.#raw);
    this.child = this.#raw.child.bind(this.#raw);
  }

}

export interface LoggerOptions extends PinoOptions {
  path: string;
}

export const Log:
  Logger
  & ((obj: any, message?: string, ...props: any[]) => void) =
  Object.assign(
    (obj: any, message?: string, ...props: any[]) => {
      Log.info(obj, message, ...props);
    },
    new Logger({
      name: process.env.LOG_NAME ?? 'maestro-logger',
      enabled: String(process.env.DISABLE_LOG) !== "false",
      path: process.env.LOG_PATH ?? 'logs/'
    })
  );
