import { PicklistData } from '../../gridComponent/model/picklistData';
import { IRead } from './IRead';
import { IWrite } from './IWrite';
import { IModelBase } from './IModelBase'

// inteligentnejsi nazov, aby bolo jasne, ze sa tam pouzivaju BS
export class Repository<T> implements IWrite<T>, IRead<T>{
    private newType: () => any;
    public baseCollection:T[];
    public baseItemTotalCount: number;
    public tuple: [ number, any[] ] = [0, []];

    constructor(   type?: { new(): T ;}   ){
        if (type)
        {
            this.newType = () => {return new type;};
            this.baseCollection = [{}].map(item => {return new type;});
            this.tuple[0] = 0;  // TODO
            this.tuple[1] = this.baseCollection;
        }
    }
    
    // call fromJson on each item
    fromJson<T extends IModelBase>(data: any[], picklists: PicklistData[]) {
        this.baseCollection = data.map(item => {
            let model = this.newType();
            (model as IModelBase).fromJsonObject(item, picklists);
            return model;
        });

        this.tuple[1] = this.baseCollection;

        return this;
    }

    //adding one item
    add(item: T) {
        // use replaceAll instead, because dbCount has to be updated
        this.baseCollection = [...this.baseCollection, item];
        this.tuple[0] = 0;  // TODO
        this.tuple[1] = this.baseCollection;
    }
    //adding multiple items
    addRange(item: T[]) {  
        throw new Error('Method not yet implemented;');
    }
    //modifying one item
    replace(id: string, item: T) {
        throw new Error('Method not yet implemented;');
    }
    //replacing all items with another set of items    
    replaceAll(items: T[], dbCount: number){
        this.baseCollection = items;
        this.baseItemTotalCount = dbCount;
        this.tuple[0] = dbCount;
        this.tuple[1] = this.baseCollection;
    } //?
    //remove single item
    remove(id: string) {
        throw new Error('Method not yet implemented;');
    }
    //remove all items
    removeAll() {
        throw new Error('Method not yet implemented;');
    }
    //get item by identifier
    getById(id: string): T {
        throw new Error('Method not yet implemented;');
    }
    //get all items
    getAll(): T[] {
        return this.baseCollection;
    }

    getCount(): number{
        return this.baseItemTotalCount;
    }

    setCount(dbCount: number){
        this.baseItemTotalCount = dbCount;
        this.tuple[0] = dbCount;
    }

    getTuple(): any {
        return this.tuple;
    }

    private updateItemCount(): void{
        throw new Error('Method not yet implemented;');
    }


}