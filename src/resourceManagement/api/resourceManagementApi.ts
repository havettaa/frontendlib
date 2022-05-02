import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class ResourceManagementApi {
  constructor(private client: HttpClient) {}

  public get(url: string, options?: any): Observable<any> {
    return this.client.get(url, options);
  }

  // public post(url: string, data: any, options?: any) {
  //   return this.client.post(url, data, options);
  // }

  public post(url: string, body: any, headers: any): Promise<Response>{
      return fetch(url, { method: 'POST', body: body, headers: headers });
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
