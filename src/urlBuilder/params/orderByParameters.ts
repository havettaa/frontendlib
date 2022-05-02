import { eOdataOrderBy } from '../enumerators/eOdataOrderBy';
import { IOdataParameter } from './IOdataParameter';

export class OrderByParams implements IOdataParameter {
  private parameters: string[];

  constructor() {
    this.parameters = [];
  }

  public push(key: string, operator: eOdataOrderBy): void {
    this.parameters.push(`${key} ${operator}`);
  }

  public toString(): string {
    if (this.parameters.length === 0) return '';

    return `orderBy=${this.parameters.join(',')}`;
  }

  public getParameters(): string[]{
    return this.parameters;
  }

  public merge(orderByParams: OrderByParams){
    if(orderByParams){
      this.parameters = this.parameters.concat(orderByParams.parameters);
    }
  }
}
