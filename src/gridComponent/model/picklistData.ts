import { Repository } from '../../core/repository/RepositoryBase';
import { PicklistItem } from './picklistItem';

export class PicklistData {
     
     name: string;
     values: Repository<PicklistItem> = new Repository<PicklistItem>(PicklistItem); 


     fromJson(name: string, input: any, config: any)
     {
     this.values.baseCollection.splice(0)
          if (input && name){
               this.name = name;
               input.forEach(item => {
                    let data = new PicklistItem();               
                    data.value = "";
                    config.value.forEach((element, index) => {
                         if(data.value != "") data.value += " ";
                         data.value += item[config.value[index]];
                    });
                    data.vid = item[config.key];
                    this.values.add(data);
               });
          }
          return this;
     }
}



