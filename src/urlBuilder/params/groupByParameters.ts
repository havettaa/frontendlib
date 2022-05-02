import { IOdataParameter } from './IOdataParameter';

export class GroupByParams implements IOdataParameter {
  private parameters: string[];

  constructor() {
    this.parameters = [];
  }

  public push(key: string): void {
    this.parameters.push(key);
  }

  public toString(): string {
    if (this.parameters.length === 0) return '';

    return `groupBy=((${this.parameters.join(',')}))`;
  }

  public getParameters(): string[]{
    return this.parameters;
  }
}
