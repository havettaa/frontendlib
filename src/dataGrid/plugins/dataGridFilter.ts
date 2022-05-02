import { html } from "../../common/createHtml";


export function render(container: HTMLElement, config: any, eventLoad: ()=>void) {
  const configFilter = {...new DataGridFilterConfig(), ...config};
  const instance = new DataGridFilter(container, configFilter, eventLoad);
  instance.doRender();
  return instance;
}


type ColTypes = `picklist` | `bool` | `number` | `date` | `datetime` | `string`; // if none, then string is used as default


export class DataGridFilterConfig {
	localStorageKey?: string = ``;
  columnTypes?: {[Key: string]: ColTypes} = {};
  picklists?: {[Key: string]: any} = {};
}


export class DataGridFilter {
  private container: HTMLElement;
  private config: DataGridFilterConfig;
  private eventLoad: ()=>void = ()=>{};


  constructor(container: HTMLElement, config: DataGridFilterConfig, eventLoad: ()=>void) {
    this.container = container;
    this.config = config;
    this.eventLoad = eventLoad;
	}


  doRender() {
    const children = this.container?.querySelector(`thead>tr`)?.childNodes;
    children?.forEach((th: any) => {
      const colName = this.getColName(th);
      const colState = this.selectState()?.[colName];
      const iconAppears = colState ? `appear` : ``;

      const existingNode = th?.querySelector('.filterIcon');
      if (existingNode) th?.removeChild(existingNode);

      th?.appendChild(
        html(`div`, {class: `filterIcon ${iconAppears}`}, [
          this.createSvgIcon()
        ], {onclick: (e: any) => this.showFilterDialogClick(e)})
      );

      this.createFilterDialog(th);
    });

    // on click away, hide dialog
    document.addEventListener(`mouseup`, function (this: any, e: any) {
      const dialog = document.querySelector(`.filterDialog.showDialog`);
      // If we click inside the dialog or on filterIcon, skip the if
      if (!dialog?.parentElement?.contains(e.target) ) {
        dialog?.classList?.remove(`showDialog`);
      }
    }.bind(this));
  }


  createSvgIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute(`viewBox`,`0 0 500 500`);
    svg.setAttribute(`width`, `15`);
    svg.setAttribute(`height`, `15`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z');
    svg.appendChild(path);
    return svg;
  }


  showFilterDialogClick(e: any) {
    e.stopPropagation();
    let th = e.target?.closest(`th`);
    const dialog = th?.querySelector(`.filterDialog`)
    dialog?.classList?.toggle(`showDialog`);
  }


  createFilterDialog(th: HTMLElement) {
    const existingNode = th?.querySelector('.filterDialog');
    if (existingNode) th?.removeChild(existingNode);

    th?.appendChild(
      html(`div`, {class:`filterDialog`}, [
        html(`span`,{class:`closeButton`},`✖️`, {onclick: (e: any) => e?.target?.parentElement?.classList?.remove(`showDialog`)}),
        this.createColumnTypeInputs(th),
        html(`button`, {class:`filterButton`}, `✔️ Filter`, { onclick: this.filterSave.bind(this) })
      ], { onclick: (e: any) => e.stopPropagation()})
    );
  }


  createColumnTypeInputs(th: any) {
    const colName = this.getColName(th);
    const colType = this.getColType(colName);
    const colState = this.selectState()?.[colName];

    const inputUniqueId = `${this.config.localStorageKey!}~-~${colName}`;
    let returnElement;

    if (colType === `picklist`) {
      let list = [];
      const picklist = this.config?.picklists?.[colName];
      for(const i in picklist) {
        const id:string = String(picklist[i]?.Id);
        const inputName = `${inputUniqueId}~-~${id}`;
        const isChecked:boolean = colState?.includes(id);
        const checked = isChecked ? {checked: true} : {};
        list.push(
          html(`label`, {class:`labelcheckbox`,for:inputName},[
            html(`input`, {type:`checkbox`,itemprop:id,name:inputName,id:inputName,...checked}),
            html(`span`, {}, picklist[i]?.Name),
          ])
        );
      }
      returnElement = html(`div`,{}, list);
    }
    else if (colType === `bool`) {
      const trueValues  = colState?.trueValues  ? {checked: true} : {};
      const falseValues = colState?.falseValues ? {checked: true} : {};

      returnElement = html(`div`,{},[
        html(`label`, {class:`labelcheckbox`,for:`true~-~${inputUniqueId}`},[
          html(`input`, {...trueValues ,type:`checkbox`,itemprop:`trueValues`,name:`true~-~${inputUniqueId}`,id:`true~-~${inputUniqueId}`}),
          html(`span`, {}, `True`),
        ]),
        html(`label`, {class:`labelcheckbox`,for:`false~-~${inputUniqueId}`},[
          html(`input`, {...falseValues,type:`checkbox`,itemprop:`falseValues`,name:`false~-~${inputUniqueId}`,id:`false~-~${inputUniqueId}`}),
          html(`span`, {}, `False`),
        ])
      ]);
    }
    else if (colType === `number` || colType === `date` || colType === `datetime`) {
      returnElement = html(`div`,{},[
        html(`div`,{},[ 
          html(`label`, {}, `From: `),
          html(`input`, {type:colType.startsWith(`date`) ? `date`: 'text',itemprop:`from`,value:colState?.from??``}),
          (colType === `datetime`) ? html(`input`, {type:`time`,itemprop:`timeFrom`,value:colState?.timeFrom??``}) : html(`span`)
        ]),
        html(`div`,{},[
          html(`label`, {}, `To: `),
          html(`input`, {type:colType.startsWith(`date`) ? `date`: 'text',itemprop:`to`,value:colState?.to??``}),
          (colType === `datetime`) ? html(`input`, {type:`time`,itemprop:`timeTo`,value:colState?.timeTo??``}) : html(`span`)
        ])
      ]);
    }
    else {
      returnElement = html(`div`,{},[
        html(`div`,{},[
          html(`label`, {}, `Search: `),
          html(`input`, {itemprop:`search`,value:colState??``}),
        ])
      ]);
    }

    return returnElement;
  }


  filterSave(e: any) {
    e.stopPropagation();

    const th = e.target?.closest(`th`);
    const colName = this.getColName(th);
    const newValues = this.getFilterInputsValues(th, colName);
    
    this.setColState(colName, newValues);

    th?.querySelector('.filterIcon')?.classList?.add(`appear`);

    this.eventLoad();
  }


  getFilterInputsValues(th: any, colName: string) {
    const colType = this.getColType(colName);

    const dialog = th?.querySelector(`.filterDialog`);

    let retVal = {};
    if (colType === `picklist`) {
      let list = dialog?.querySelectorAll(`input[type=checkbox]`);
      const ids: string[] = [];
      for(const i in list) {
        if (list[i]?.tagName === `INPUT`  &&  list[i]?.checked) {
          const id = list[i]?.getAttribute(`itemprop`);
          ids.push(id);
        }
      }
      retVal = ids;
    }
    else if (colType === `bool`) {
      const trueCheck = dialog?.querySelector(`input[itemprop=trueValues]`)?.checked;
      const falseCheck = dialog?.querySelector(`input[itemprop=falseValues]`)?.checked;
      retVal = {trueValues: trueCheck, falseValues: falseCheck};
    }
    else if (colType === `number` || colType === `date` || colType === `datetime`) {
      const f = dialog?.querySelector(`input[itemprop=from]`)?.value;
      const t = dialog?.querySelector(`input[itemprop=to]`)?.value;
      retVal = {from: f, to: t};
      if (colType === `datetime`) {
        const timeF = dialog?.querySelector(`input[itemprop=timeFrom]`)?.value;
        const timeT = dialog?.querySelector(`input[itemprop=timeTo]`)?.value;
        retVal = {...retVal, timeFrom: timeF, timeTo: timeT};
      }

    }
    else {
      retVal = dialog?.querySelector(`input[itemprop=search]`)?.value;
    }
    return retVal;
  }


  getColType(colName: string) {
    return this.config?.columnTypes?.[colName] ?? `string`;
  }


  getColName(th: any) {
    let colName = th?.getAttribute(`itemprop`);
    if (!colName) {
      colName = new String(th?.firstChild?.textContent).trim();
      th?.setAttribute(`itemprop`, colName);
    }
    return colName;
  }


  setColState(colName: string, newValues: any) {
    let state = this.selectState();
    state[colName] = newValues;
    this.setState(state);
  }


  setState(newValue: object) {
    window.localStorage.setItem(this.config.localStorageKey!, JSON.stringify(newValue));
	}


  clearState(newValue: object) {
    window.localStorage.removeItem(this.config.localStorageKey!);
	}


  selectState() {
		return JSON.parse(window.localStorage.getItem(this.config.localStorageKey!) ?? `{}`);
	}

}