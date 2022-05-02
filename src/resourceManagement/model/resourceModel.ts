export class ResourceModel {
    constructor(map?: Map<string, any>){
        if (map != null || map != undefined)
            this.resources = map;
        else {
            this.resources = new Map<string, any>();
        }
    }
    
    private resources: Map<string, any>;

    public getByName(name: string): any{
        return this.resources.get(name);
    }

    public contains(name: string): boolean{
        return this.resources.has(name);
    }

    public add(resource: any, name: string) {
        if (!this.resources.has(name))
            this.resources.set(name, resource);
    }
}