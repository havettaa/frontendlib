import { LogEntry } from '../model/logEntry';

export interface IPublisher {
    log(message: LogEntry);    

    location: string;

    getLogs(): LogEntry[];
}