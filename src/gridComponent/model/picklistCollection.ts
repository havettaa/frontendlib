import { PicklistData } from './picklistData';

export class PicklistCollection {
  picklists: PicklistData[] = [];

  public getByName(name: string): PicklistData {
    return this.picklists.find((picklist) => {
      picklist.name === name;
    });
  }
  public push(data: PicklistData)  {
    this.picklists.push(data);
  }
}
