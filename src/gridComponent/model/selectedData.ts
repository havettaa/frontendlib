import { GridData } from "./base/gridData";

export class SelectedData implements GridData{
    selectedKey: string;
    selectedValue?: string;
    multiSelectValues?: string[];
}