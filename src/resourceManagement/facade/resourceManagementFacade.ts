import { Injectable } from '@angular/core';
import { ResourceManagementApi } from '../api/resourceManagementApi';
import { ResourceModel } from '../model/resourceModel';
import { ResourceManagementState } from '../state/resourceManagementState';

@Injectable({providedIn: 'root'})
export class ResourceManagementFacade {
  constructor(
    private state: ResourceManagementState,
    
  ) {
    this.state
      .getResources()
      .subscribe((resources) => (this.resources = resources));
  }

  private isLoadInProgress: boolean;
  private resources: ResourceModel;
  // tableName === the resource Url
  // checks if the resource is already loaded
  // if not, loads the singular resource and adds it to the pool
  // then gets the value of valueName from the pool according to the keyname and value

  async getResource(
    tableName: string,
    keyName?: string,
    keyValue?: string,
    valueName?: string,
    token?: string,
    optionalParamName?: string,
    optionalParamValue?: string
  ) {
    var result: string;

    if (!this.resources.contains(tableName))
    {
      if (!this.isLoadInProgress)
        await this.loadResource(tableName, token);  
        else {
          var promise = new Promise((resolveCallback) => {
            this.state.isUpdatingFinished$.subscribe(async(isFinished) => {
              if (isFinished) {
                if (!this.resources.contains(tableName))
                  var result = await this.loadResource(tableName, token);
                  resolveCallback(result);
              }
            });
          });
          await promise;
        }
    }


    var table = this.resources.getByName(tableName);

    if (!keyName)
      return table;

    table?.value.forEach((element) => {
      if (
        valueName === element[keyName] &&
        optionalParamValue === element[optionalParamName]
      )
        result = element[keyValue];
    });
    return result ;
  }

  async getResourceTable(url: string, token?: string) {
    if (!this.resources.contains(url))
        await this.getResource(url);

    return this.resources.getByName(url);
  }

  public reloadResource(tableName: string, token?: string) {
    this.loadResource(tableName, token);
  }

  private async loadResource(url: string, token?: string) {
    if (url != undefined) {
      this.isLoadInProgress = true;
      var result = await this.state.loadResource(url, token);
      this.resources.add(result, url);
      this.state.setResources(this.resources);
      
      this.isLoadInProgress = false;

    }
  }
}
