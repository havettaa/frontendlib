import { NgModule } from '@angular/core';
import { GridComponentModule } from './gridComponent/gridComponent.module';
import { RichTextModule } from './richTextComponent/richText.module';
import { LastRouteService } from './lastRouteService/lastRoute.service';
import { LocalStorageModule } from './localStorage/localStorage.module';
import { ResourceManagementModule } from './resourceManagement/resourceManagement.module';
import { LoggerModule } from './logger/logger.module';
import { AuthenticationModule } from './authentication/authentication.module';

@NgModule({
  declarations: [],
  imports: [
    GridComponentModule, RichTextModule, LocalStorageModule, ResourceManagementModule,
      LoggerModule, AuthenticationModule
  ],
  providers: [LastRouteService],

  exports: [GridComponentModule, RichTextModule, LocalStorageModule, ResourceManagementModule,
    LoggerModule, AuthenticationModule
  ]
})
export class ewfrontendlibModule { }
