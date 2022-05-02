import { NgModule } from '@angular/core';
import { LoggerFacade } from './loggerFacade';
import { LoggerState } from './state/loggerState';



@NgModule({
  declarations: [],
  imports: [],
  providers: [LoggerFacade, LoggerState],
  
})
export class LoggerModule { }
