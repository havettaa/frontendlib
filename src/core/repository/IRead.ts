export interface IRead<T> {

    getById(id: string): T;

    getAll(): T[];

}