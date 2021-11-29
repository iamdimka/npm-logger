export default class Logger {
  protected common: Record<string, any> = {};
  protected nested?: Logger[];

  constructor(
    protected writeStream: NodeJS.WritableStream = process.stdout,
    protected scope?: string
  ) { }

  setCommonData(data: Record<string, any>, append?: boolean) {
    for (const param of ["scope", "level", "msg", "time"]) {
      if (param in data) {
        throw new Error(`Could not set ${param} as common data`);
      }
    }

    this.common = Object.assign(append ? this.common : {}, data);
    return this;
  }

  subScope(scope: string) {
    if (!this.nested) {
      this.nested = [];
    }

    const logger = new Logger(this.writeStream, this.scope ? `${this.scope}:${scope}` : scope);
    this.nested.push(logger);
    return logger;
  }

  setWriteStream(writeStream: NodeJS.WritableStream) {
    this.writeStream = writeStream;
    if (this.nested) {
      for (const logger of this.nested) {
        logger.writeStream = writeStream;
      }
    }
    return this;
  }

  log(level: string, message: string, data?: Record<string, any>) {
    if (data) {
      this.writeStream.write(JSON.stringify({ scope: this.scope, level, msg: message, ...this.common, ...data, time: new Date().toISOString() }) + "\n");
    } else {
      this.writeStream.write(JSON.stringify({ scope: this.scope, level, msg: message, ...this.common, time: new Date().toISOString() }) + "\n");
    }
  }

  debug(message: string, data?: Record<string, any>) {
    this.log("debug", message, data);
  }

  info(message: string, data?: Record<string, any>) {
    this.log("info", message, data);
  }

  warn(message: string, data?: Record<string, any>) {
    this.log("warn", message, data);
  }

  error(message: string, data?: Record<string, any>) {
    if (data instanceof Error) {
      data = {
        code: (data as any).code || undefined,
        error: data.message,
        stack: data.stack || undefined
      };
    }

    this.log("error", message, data);
  }
}