import { UrlBuilder } from '../../urlBuilder/urlBuilder';
import { UrlCollection } from '../../urlBuilder/urlCollection';
import { IModelBase } from './IModelBase';
import { Repository } from './RepositoryBase';

export class RepositoryManagement {

  constructor() {}

  populateRepositories(UrlCollection: UrlCollection, results: any[], picklistData: any[]): Array<Repository<IModelBase>>{
    let array = new Array<Repository<IModelBase>>();
    results.forEach((result, index) => {
      let data;
      if(result.value == undefined){
        data = result
      } else {
        data = result.value;
      }
      const totalCount = result[`@odata.count`];
      const funcCreateRepo: () => any = UrlCollection.getCreateRepoFunction(index);
      const repo = funcCreateRepo();
      repo.fromJson(data, picklistData );
      repo.setCount(totalCount);
      array.push(repo)
    });

    return array;
  }
}