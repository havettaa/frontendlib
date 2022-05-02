import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationApi {
  constructor(private client: HttpClient) {}

  // public get(url: string, options?: any): Observable<any> {
  //   this.client.get<any>(url, options);
  // }

  public get(url: string, body: any,  headers: any): Response {
    try {
      var response: Response;
      fetch(url, { method: 'GET'})
        .then((data: Response) => response = data);
      
        return response;

    } catch (error) { return undefined }
  }

  // public post(url: string, data: any, options?: any) {
  //   return this.client.post(url, data, options);
  // }

  public post(url: string, body: any, headers: any): Promise<Response>{
      var response: Response;
      return fetch(url, { method: 'POST', body: body, headers: headers }).catch();
  }

  public put(url: string, data: any, options?: any) {
    return this.client.put(url, data, options);
  }

  public patch(url: string, data: any, options?: any) {
    return this.client.patch(url, data, options);
  }

  public delete(url: string, options?: any) {
    return this.client.delete(url, options);
  }
}
