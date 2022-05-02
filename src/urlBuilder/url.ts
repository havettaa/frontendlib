import { UrlBuilder } from "./urlBuilder";

export class Url {
    urlId: string;
    url: string;
    modelType: () => any;

    urlBuilder?: UrlBuilder;
}
