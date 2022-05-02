import { eOdataOperator } from '../enumerators/eOdataOperator';
import { IOdataParameter } from './IOdataParameter';

export class QueryParameters implements IOdataParameter {
  private parameters: string[];

  constructor() {
    this.parameters = [];
  }

  public push(key: string, value: string, operator: eOdataOperator): void {
    this.parameters.push(`${key} ${operator} '${value}'`);
  }
  public pushNumber(key: string, value: number, operator: eOdataOperator): void {
    this.parameters.push(`${key} ${operator} ${value}`);
  }

  public pushTextSearch(key: string, value: string): void{
    this.parameters.push(`contains(tolower(${key}),'${value.toLowerCase()}')`)
  }

  public pushDate(key: string, value: string, operator: eOdataOperator): void {
    this.parameters.push(`${key} ${operator} ${value}`);
  }

  public pushPicklistText(key: string, values: string[]): void {
    let picklist: string[] = [];
    values.forEach(element => {
      picklist.push(`${key} ${eOdataOperator.Equals} '${element}'`)
    });
    let joinedPickllist = picklist.join(` ${eOdataOperator.Or} `);
    this.parameters.push(`(${joinedPickllist})`);
  }

  public pushPicklistNumber(key: string, values: string[]): void {
    let picklist: string[] = [];
    values.forEach(element => {
      picklist.push(`${key} ${eOdataOperator.Equals} ${element}`)
    });
    let joinedPickllist = picklist.join(` ${eOdataOperator.Or} `);
    this.parameters.push(`(${joinedPickllist})`);
  }

  public toString(): string {
    if (this.parameters.length === 0) return '';

    return `filter=${this.parameters.join(` ${eOdataOperator.And} `)}`;
  }

  public getParameters(): string[]{
    return this.parameters;
  }

  public merge(queryParameters: QueryParameters){
    if(queryParameters){
      this.parameters = this.parameters.concat(queryParameters.parameters);
    }
  }
}
