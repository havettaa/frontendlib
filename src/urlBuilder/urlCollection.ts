import { Url } from "./url";
import { UrlBuilder } from "./urlBuilder";
import { IOdataParameter } from './params/IOdataParameter'

export class UrlCollection {
    private urlsWithParams: Url[] = [];
    private apiUrl: string;

    constructor(firstItem?: Url) {
        if (firstItem)
            this.urlsWithParams.push(firstItem);
    }

    setBaseUrl(apiUrl: string): UrlCollection {
        this.apiUrl = apiUrl;
        return this;
    }

    setUrlParamsById(urlId: string, params: IOdataParameter[]) {
        const currentUrlBuilder: UrlBuilder = this.getUrlBuilderById(urlId);
        const newUrlBuilder: UrlBuilder = new UrlBuilder(currentUrlBuilder.getBaseUrl(), params);
        this.urlsWithParams.find(item => item.urlId === urlId).urlBuilder = newUrlBuilder;
    }

    add(urlId: string, urlBuilder: UrlBuilder, funcCreateRepo: () => any) {
        this.urlsWithParams.push({ urlId: urlId, url: '', modelType: funcCreateRepo, urlBuilder: urlBuilder });
    }

    addMany(urlIdWithOdataParam: [string, IOdataParameter[]][], usedUrls: Url[]) {
        this.clear();
        urlIdWithOdataParam.forEach(element => {
            const u = usedUrls.find(i => i.urlId === element[0])
            this.add(u.urlId, new UrlBuilder(u.url, element[1]), u.modelType);
        });
    }

    rewrite(urlId: string, odataParameters: IOdataParameter[]) {
        const singleUrl = new UrlCollection(this.getSingleItemById(urlId));
        singleUrl.setBaseUrl(this.apiUrl);
        singleUrl.setUrlParamsById(urlId, odataParameters);
        return singleUrl;
    }

    clear() {
        this.urlsWithParams.length = 0;
        this.urlsWithParams = [];
    }

    getAll(): Url[] {
        return this.urlsWithParams;
    }

    getFullUrls(): string[] {
        return this.urlsWithParams.map(i => this.apiUrl + i.urlBuilder.getUrl());
    }

    getCreateRepoFunction(index: number): () => any {
        return this.urlsWithParams[index].modelType;
    }

    getUrlId(index: number): string {
        return this.urlsWithParams[index].urlId;
    }

    getSingleItemById(urlId: string): Url {
        return this.urlsWithParams.find(item => item.urlId === urlId);
    }

    getUrlBuilderById(urlId: string): UrlBuilder {
        return this.urlsWithParams.find(item => item.urlId === urlId).urlBuilder;
    }

    getUrlBuildersByIds(urlIds: string[]): UrlBuilder[] {
        const urlCollection = this.urlsWithParams.filter(item => urlIds.includes(item.urlId));
        return urlCollection.map(i => i.urlBuilder);
    }
}