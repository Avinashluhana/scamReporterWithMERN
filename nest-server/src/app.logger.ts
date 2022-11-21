import { Injectable, LoggerService, LogLevel, Scope } from "@nestjs/common";

@Injectable({
  scope: Scope.TRANSIENT
})
export class AppLogger implements LoggerService {

  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(`[${this.context}] ${message} ${optionalParams}`);
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(`[${this.context}] ${message} ${optionalParams}`);
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(`[${this.context}] ${message} ${optionalParams}`);
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.debug(`[${this.context}] ${message} ${optionalParams}`);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.info(`[${this.context}] ${message} ${optionalParams}`);
  }

  setLogLevels?(levels: LogLevel[]) {
  }
}