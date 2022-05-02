import { html } from "../../common/createHtml";


export function render(container: HTMLElement, config: any, eventLoad: ()=>void) {
  const instance = new DataGridSorter(container, config, eventLoad);
  instance.doRender();
  return instance;
}


export class DataGridSorterConfig {
	localStorageKey?: string = ``;
  noSortingOnColumns?: string[] = [];
}


export class DataGridSorter {
  private container: HTMLElement;
  private config: any;
  private eventLoad: ()=>void = ()=>{};
  

  constructor(container: HTMLElement, config: any, eventLoad: ()=>void) {
    this.container = container;
    this.config = config;
    this.eventLoad = eventLoad;
	}

  
  doRender() {
    const children = this.container?.querySelector(`thead>tr`)?.childNodes;
    children?.forEach((th: any) => {
      const colName = this.getColName(th);

      th.onclick = (e: any) => this.sortClick(e);
      
      const existingNode = th?.querySelector('.sortIcon');
      if (existingNode) th?.removeChild(existingNode);
      
      
      th?.appendChild(
        html(`div`, {class: `sortIcon`})
      );
    });

    this.displayFromState();
  }


  displayFromState() {
    let state: Array<any> = this.selectState();

    const allIcons = this.container?.querySelectorAll(`.sortIcon`);
    for(const i in allIcons) {
      if (allIcons[i] && allIcons[i]?.tagName === `DIV`)
        allIcons[i].textContent = ``;
    }

    for (const index in state) {
      const colName = state[index]?.name;
      const direction = state[index]?.direction===`desc`?`▼`:`▲`;
      const sortIcon = this.container?.querySelector(`th[itemprop='${colName}'] .sortIcon`);
      if (sortIcon)
        sortIcon.textContent = `${direction}${+index+1}`
    }
  }


  sortClick(e: any) {
    let th = e.target?.closest(`th`);
    const colName = this.getColName(th);

    let state: Array<any> = this.selectState();
    if (!state)
      state = [];

    const index = state?.findIndex(i => i?.name === colName);
    if (index != -1) {
      if (state[index]?.direction === `asc`)
        state[index].direction = `desc`;
      else
        state.splice(index,1);
    }
    else {
      const newItem = {name: colName, direction: `asc`};
      state.push(newItem);
    }

    this.setState(state);
    
    this.displayFromState();
    this.eventLoad();
  }


  getColName(th: any) {
    let colName = th?.getAttribute(`itemprop`);
    if (!colName) {
      colName = new String(th?.firstChild?.textContent).trim();
      th?.setAttribute(`itemprop`, colName);
    }
    return colName;
  }

  
  setState(newValue: object) {
    window.localStorage.setItem(this.config.localStorageKey!, JSON.stringify(newValue));
	}


  clearState(newValue: object) {
    window.localStorage.removeItem(this.config.localStorageKey!);
	}


  selectState() {
		return JSON.parse(window.localStorage.getItem(this.config.localStorageKey!) ?? `[]`);
	}

}
