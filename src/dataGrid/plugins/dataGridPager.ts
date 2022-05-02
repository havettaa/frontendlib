import { html } from "../../common/createHtml";


export function render(container: HTMLElement, config: any, eventLoad: ()=>void) {
  const instance = new DataGridPager(container, config, eventLoad);
  instance.doRender();
  return instance;
}


export class DataGridPagerConfig {
	localStorageKey?: string = ``;
  itemsPerPage?: number = 10;
  langItemsPerPage?: string = `Items per page`;
  langOf?: string = `of`;
}


export class DataGridPager {
  private container: HTMLElement;
  private config: any;
  private eventLoad: ()=>void = ()=>{};
  

  constructor(container: HTMLElement, config: any, eventLoad: ()=>void) {
    this.container = container;
    this.config = config;
    this.eventLoad = eventLoad;
	}

  
  doRender() {
    const parent = this.container?.parentElement;
    const existingNode = parent?.querySelector(`${this.config.localStorageKey}`);
    if (existingNode) parent?.removeChild(existingNode);

		this.container?.insertAdjacentElement(`afterend`, 
      html(`div`,{class:`cssDataGridPager ${this.config.localStorageKey}`}, [
        html(`span`, {}, `＜`, {onclick: () => {
          this.eventLoad();
        }}),
        html(`input`, {class:``, style:`; width: 30px`, placeholder:`page number`}, ``),
        html(`span`, {}, `＞`, {onclick: () => {
          this.eventLoad();
        }})
      ])
    );
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
