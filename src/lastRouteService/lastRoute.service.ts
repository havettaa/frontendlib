import { Injectable, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LastRouteService implements OnDestroy {

  constructor() {}

  private previousUrl:string;

  private currentUrl: string;

  private subscription: Subscription = new Subscription();

  private readonly localStorageKeyConst: string = "lastRoute";

  //to be called only in app.component!!!!!
  public subscribeToRoute(router: Router) {
    if (this.previousUrl)
      return;
      
    this.previousUrl = this.loadRouteFromLocalStorage();

    this.subscription.add(router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.previousUrl = this.previousUrl ?? this.currentUrl;
      this.currentUrl = event.url;
    }));
  }

  public getPreviousUrl(): string{
    return this.previousUrl;
  }

  public ngOnDestroy(){
    this.saveRouteToLocalStorage();
    this.subscription.unsubscribe();
  }

  private saveRouteToLocalStorage(){
    if (!!window.localStorage)
      localStorage.setItem(this.localStorageKeyConst, this.previousUrl);
  }

  private loadRouteFromLocalStorage(): string{
    if (!!window.localStorage){
      return localStorage.getItem(this.localStorageKeyConst);
    }
    return null;
  }
}
