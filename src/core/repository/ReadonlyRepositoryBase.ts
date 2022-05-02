import { IRead } from './IRead';

export abstract class ReadonlyRepository<T> implements IRead<T>{
    private collection: T[];
    private itemCount: number;

    constructor(items: T[], itemCount: number) {
        this.collection = items;
        this.itemCount = itemCount;
    }

    getById(id: string): T {
        throw new Error('Method not yet implemented;')
    }

    getAll(): T[] {
        throw new Error('Method not yet implemented;');
    }

    getItemCount(): number{
        return this.itemCount;
    }


}