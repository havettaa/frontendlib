import { LogLevel } from '../enums/logLevel';

export class LogEntry {
  entryDate: Date = new Date();
  message: string = '';
  logLevel: LogLevel = LogLevel.Debug;
  params: any[] = [];
  logWithDate: boolean = true;

  buildLogString(): string {
    let ret: string = '';

    if (this.logWithDate) {
      ret = new Date() + ' - ';
    }

    ret += 'Type: ' + LogLevel[this.logLevel];
    ret += ' - Message: ' + this.message;
    if (this.params.length) {
      ret += ' - Parameters: ' + this.formatParams(this.params);
    }

    return ret;
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');

    if (params.some((p) => typeof p == 'object')) {
      ret = '';

      for (let item of params) {
        ret += JSON.stringify(item) + ',';
      }
    }
    return ret;
  }
}
