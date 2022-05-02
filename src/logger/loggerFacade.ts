import { Injectable } from '@angular/core';
import { LogLevel } from "./enums/logLevel";
import { IPublisher } from './interfaces/IPublisher';
import { LoggerState } from "./state/loggerState";

@Injectable()

export class LoggerFacade{
    
    constructor(private state: LoggerState){}
      info(message: any, ...optionalParams: any[]) {
        this.state.log(message, LogLevel.Info, optionalParams);
      }
    
      debug(message: any, ...optionalParams: any[]) {
        this.state.log(message, LogLevel.Debug, optionalParams);
      }
    
      error(message: any, ...optionalParams: any[]) {
        this.state.log(message, LogLevel.Error, optionalParams);
      }

      setLogWithDate(value: boolean){
        this.state.setLogWithDate = value;
      }

      setLogLevel(value: LogLevel){
        this.state.setLogLevel = value;
      }

      addPublisher(publisher: IPublisher ){
        this.state.addPublisher(publisher);
      }

      getLogs(){
        
      }
}
