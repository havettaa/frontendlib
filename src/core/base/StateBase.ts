import { IModelBase } from '../repository/IModelBase';
import { Repository } from '../repository/RepositoryBase';

export abstract class StateBase {

    constructor(){
        this.data = new Repository<IModelBase>();
    }

    protected data: Repository<IModelBase>;

    public abstract setRepository<IModelBase>(identifier: string, data: Repository<IModelBase>);

    public abstract getRepository(identifier: string);

}