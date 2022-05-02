export interface IWrite<T> {

    add(item: T);

    addRange(item: T[]);

    replace(id: string, item: T);

    remove(id: string);

}