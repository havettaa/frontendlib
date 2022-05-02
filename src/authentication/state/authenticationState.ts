import { Injectable, resolveForwardRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationApi } from '../api/authentication.service';
import { UserModel } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthenticationState {
  private currentUserSubject: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>(
    JSON.parse(localStorage.getItem('currentUser'))
  );
  public currentUser$: Observable<UserModel> = this.currentUserSubject.asObservable();

  private isUpdatingFinished: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isUpdatingFinished$: Observable<boolean> = this.isUpdatingFinished.asObservable();

  private readonly accessTokenName = 'access_token';
  private readonly refreshTokenName = 'refresh_token';

  constructor(private service: AuthenticationApi) {
    this.isUpdatingFinished = new BehaviorSubject<boolean>(false);
  }

  async login(
    username: string,
    password: string,
    url: string,
    authorization: string
  ): Promise<boolean> {
    let requestBody = new URLSearchParams();
    requestBody.set('username', username);
    requestBody.set('password', password);
    requestBody.set('grant_type', 'password');
    requestBody.set('scope', 'email profile offline_access');

    let headers = {
      Authorization: `Basic ${btoa(authorization)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Host: url,
      Origin: window.location.origin,
    };

    let response = await (
      await this.service.post(url, requestBody, headers)
    ).json();

    if (response.error_description) return false;

    localStorage.setItem(this.accessTokenName, response.access_token);
    localStorage.setItem(this.refreshTokenName, response.refresh_token);
    this.setUser(response.access_token);

    return true;
  }
  private setUser(token: string) {
    if (!token) {
      this.logout();
    }
    let jwtHelper = new JwtHelperService();

    let decodeToken = jwtHelper.decodeToken(token);

    var user = new UserModel();
    user.role = decodeToken['role'];
    user.name = decodeToken['name'];
    user.email = decodeToken['email'];
    user.surname = decodeToken['surname'];

    this.currentUserSubject.next(user);
  }



  public getIsUpdating(): Observable<boolean> {
    return this.isUpdatingFinished.asObservable();
  }

  public getToken(url: string, authorizationString: string) {
    var token = localStorage.getItem(this.accessTokenName);

    if (this.isTokenExpired(token)) {
      this.getRefreshToken(url, authorizationString);
      token = localStorage.getItem(this.accessTokenName);
      this.isUpdatingFinished.next(true);
    }

    return token;
  }

  public isLoggedIn(): boolean{
    let token = localStorage.getItem(this.accessTokenName);
    if (token && token != "undefined"){
      if(this.currentUserSubject.value === null || this.currentUserSubject.value === undefined)
        this.setUser(token)

      return true;
    }
      this.logout();
      return false;
  }

  private async getRefreshToken(url: string, authorizationString: string) {
    var refreshToken = localStorage.getItem(this.refreshTokenName);

    if (refreshToken) {
      let requestBody = new URLSearchParams();

      requestBody.set('username', this.currentUserSubject.getValue().login);
      requestBody.set(this.refreshTokenName, refreshToken);
      requestBody.set('grant_type', this.refreshTokenName);
  
      let headers = {
        Authorization: `Basic ${btoa(authorizationString)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: url,
        Origin: window.location.origin,
      };
  
      try {
        let response = await (
          await this.service.post(url, requestBody, headers)
        ).json();
        //refresh token expired check
        if (response.status === 400) this.logout();
        else {
          localStorage.setItem(this.accessTokenName, response.access_token);
          localStorage.setItem(this.refreshTokenName, response.refresh_token);
        }
      } catch (error) {
        console.log(error);
        this.logout();
      }
    }
    else this.logout();

   
  }

  private isTokenExpired(token: string): boolean {
    var jwtHelper = new JwtHelperService();
    var result = false;

    result = !(
      jwtHelper.getTokenExpirationDate(token).getTime() > new Date().getTime()
    );

    return result;
  }

  logout() {
    localStorage.removeItem(this.accessTokenName);
    localStorage.removeItem(this.refreshTokenName);
    this.currentUserSubject.next(null);
  }
}
