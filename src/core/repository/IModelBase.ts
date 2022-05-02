export interface IModelBase {
    vid: string;

    fromJsonObject(input: any, picklists: object[]): IModelBase;

    toJsonObject(picklists: object[]): any;
}