import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { ResourceManagementApi } from '../api/resourceManagementApi';
import { ResourceModel } from "../model/resourceModel";

@Injectable()

export class ResourceManagementState {

    private resources: BehaviorSubject<ResourceModel>;
    private isUpdatingFinished: BehaviorSubject<boolean>;

    public isUpdatingFinished$: Observable<boolean>;
    
    constructor(private api: ResourceManagementApi){
        this.resources = new BehaviorSubject<ResourceModel>(new ResourceModel());
        this.isUpdatingFinished = new BehaviorSubject<boolean>(false);
        this.isUpdatingFinished$ = this.isUpdatingFinished.asObservable();
    };

    async loadResource(url: string, token?: string){
        this.isUpdatingFinished.next(false);
        let result = await this.api.get(url).toPromise();
        
        return result;
    }

    setResources(value: any) {
        this.resources.next(value);
        this.isUpdatingFinished.next(true);
    }

    getResources(): Observable<ResourceModel>{
        return this.resources.asObservable();
    }

}