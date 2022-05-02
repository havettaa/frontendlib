import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationState } from '../state/authenticationState';
import { UserModel } from '../model/user';
import { iAuthenticationFacade } from 'authentication/interface/iAutheticationFacade';

@Injectable()
export class AuthenticationFacade {
  constructor(private state: AuthenticationState) { }

  private isInProgress: boolean = false;

  public getCurrentUser(): Observable<UserModel> {
    return this.state.currentUser$;
  }

  public get isUpdatingFinished(): Observable<boolean> {
    return this.state.isUpdatingFinished$;
  }

  public login(
    username: string,
    password: string,
    url: string,
    authenticationString: string
  ): Promise<boolean> {
    return this.state.login(username, password, url, authenticationString);
  }

  async getToken(url: string, authorizationString: string): Promise<string> {
    if (!this.isInProgress) {
      this.isInProgress = true;

      let token = this.state.getToken(url, authorizationString);
      this.isInProgress = false;

      return token;
    } else {
      var promise = new Promise<string>((resolveCallback) => {
        this.isUpdatingFinished.subscribe((isFinished) => {
          if (isFinished) {
            this.isInProgress = true;
            var result = this.getToken(url, authorizationString);
            resolveCallback(result);
            this.isInProgress = false;
          }
        });
      });
      return await promise;
    }
  }

  public get isLoggedIn(): boolean {
    return this.state.isLoggedIn();
  }

  public logout() {
    this.state.logout();
  }
}
