import { IModelBase } from '../repository/IModelBase';
import { IOdataParameter } from '../../urlBuilder/params/IOdataParameter';
import { Url } from '../../urlBuilder/url';
import { UrlCollection } from '../../urlBuilder/urlCollection'

export abstract class FacadeBase {

    protected urlCollection: UrlCollection;

    protected usedUrls: Url[];

    public abstract initializeData(urlIdWithOdataParam: [string, IOdataParameter[]][])
        : Promise<void>;

    public abstract refreshData(urlId: string, odataParameters: IOdataParameter[])
        : Promise<void>;

    protected abstract loadData(filteredUrlCollection: UrlCollection): Promise<void>;

    public abstract getCurrentLanguage(): string;

    public abstract getData(identifier: string): IModelBase[];
}