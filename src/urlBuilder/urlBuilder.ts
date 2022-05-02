import { IModelBase } from '../core/repository/IModelBase';
import { Repository } from '../core/repository/RepositoryBase';
import { IOdataParameter } from './params/IOdataParameter';

export class UrlBuilder {
  private baseUrl: string;
  private parameters: IOdataParameter[];

  // constructor(baseUrl: string, funcGetModel: () => any, params?: IOdataParameter[]) {
  constructor(baseUrl: string, params?: IOdataParameter[]) {
    this.baseUrl = baseUrl;
    this.parameters = [];
    if (params.length >0){
      params.forEach(element => {
        this.parameters.push(element);
      });
    }
  }

  pushParameters(parameters: IOdataParameter) {
    this.parameters.push(parameters);
  }

  public getUrl(): string {
    let query = '';

    this.parameters.forEach((element) => {
      if(element.toString() != ''){
        if(query === ''){
          (query += `?$`);
        } else {
          (query += `&$`);
        }
      }  

      query += element.toString();
    });
    
    if (!query || query !== '') return this.baseUrl + query;
 
    return this.baseUrl;
  }

  getBaseUrl(): string{
    return this.baseUrl;
  }


  getParameters(): IOdataParameter[]{
    return this.parameters;
  }
}
