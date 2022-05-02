import { LogLevel } from '../enums/logLevel';
import { LogEntry } from '../model/logEntry';
import { IPublisher } from '../interfaces/IPublisher';

export class LoggerState {
  private logLevel: LogLevel = LogLevel.All;

  private logWithDate: boolean = true;

  private publishers: IPublisher[];

  log(message: any, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      let entry: LogEntry = new LogEntry();

      entry.logWithDate = this.logWithDate;
      entry.message = message;
      entry.logLevel = level;
      entry.params = params;

      if (this.publishers.length === 0) console.log(message);
      else {
        this.publishers.forEach((p) => {
          p.log(entry);
        });
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let result: boolean = false;

    if (
      (level >= this.logLevel && level !== LogLevel.Off) ||
      level === LogLevel.All
    )
      result = true;

    return result;
  }

  public set setLogLevel(value: LogLevel) {
    this.logLevel = value;
  }

  public set setLogWithDate(value: boolean) {
    this.logWithDate = value;
  }

  addPublisher(publisher: IPublisher) {
    this.publishers.push(publisher);
  }
}
