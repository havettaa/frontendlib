import { NgModule } from '@angular/core';
import { AuthenticationFacade } from './facade/authenticationFacade';
import { AuthenticationApi } from './api/authentication.service';
import { AuthenticationState } from './state/authenticationState';

@NgModule({
  providers: [AuthenticationState, AuthenticationFacade, AuthenticationApi],
})
export class AuthenticationModule {}
