import { IOdataParameter } from "./IOdataParameter";

export class PagingParameters implements IOdataParameter{
    private pageIndex: number;
    private pageSize: number;
    private displayItemCount: boolean;

    constructor(pageIndex: number, pageSize: number, displayCount: boolean){
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.displayItemCount = displayCount;
    }
    
    public toString(): string {
         //let string = `top=${this.pageSize}&$skip=${this.pageIndex * this.pageSize}`;
        
        //pulling all data up to the last entry on the page the user is on - 
        // - workaround for paginator issue - can't only show the one page needed, but needs all the data before
        let string = `top=${this.pageSize + (this.pageIndex+1) * this.pageSize}`;

        if (this.displayItemCount)
            string += `&$count=true`;

        return string;
      }
}