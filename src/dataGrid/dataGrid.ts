// Compile ts to js
//    tsc --target esnext --outDir ..\ewfrontendlib\src\dataGrid\outDir ..\ewfrontendlib\src\dataGrid\dataGrid.ts

import { html } from "../common/createHtml";
import * as DataGridFilter from "./plugins/dataGridFilter";
import * as DataGridSorter from "./plugins/dataGridSorter";
import * as DataGridPager from "./plugins/dataGridPager";


type Plugin = {
  path: string;
  config: any;
  instance?: any;
}


export class DataGrid {
  gridId: string;
  container: HTMLElement;
  plugins: {[Key: string]: Plugin} = {};

  eventLoad: ()=>void = ()=>{};


  constructor(gridId: string) {
    this.gridId = gridId;
	}


  async render(container: HTMLElement) {
    this.container = container;
    
    await this.renderPlugins();

    this.eventLoad();
  }
  
  
  async renderPlugins() {
    // call render fuction for every plugin
    for (const pluginName in this.plugins) {
      const plugin = this.plugins[pluginName];
      const pluginPath = plugin.path;

      let pluginFuncion;
      if ( pluginPath === `filter` ||  pluginPath === `dataGridFilter.js`)
          pluginFuncion = DataGridFilter;
      else if ( pluginPath === `sorter` ||  pluginPath === `dataGridSorter.js`)
        pluginFuncion = DataGridSorter;
      else if ( pluginPath === `pager` ||  pluginPath === `dataGridPager.js`)
        pluginFuncion = DataGridPager;
      else
        pluginFuncion = await eval(`(function () { return import("${pluginPath}") })`)();

      plugin.instance = pluginFuncion?.render(this.container, plugin.config, this.eventLoad);
    }
  }


  addPlugin(pluginName: string, pluginConfig: any) {
    const plugin: Plugin = {path: pluginName, config: {...pluginConfig, localStorageKey: `${this.gridId}_${pluginName}`} };
    this.plugins[pluginName] = plugin;
  }


  selectState(pluginName: string) {
    const instance = this.plugins[pluginName]?.instance;
    return instance?.selectState();
  }


  clearState(pluginName: string) {
    const instance = this.plugins[pluginName]?.instance;
    instance?.clearState();
  }


  clearAllState() {
    for (const pluginName in this.plugins) {
      this.clearState(pluginName)
    }
    this.render(this.container);
  }


  addButton(buttonText: string, onclickCallBack: ()=>void) {
    this.container?.insertAdjacentElement(`beforebegin`, 
      html(`span`,{}, [
        html(`button`, {class:`cssDataGridButton`}, buttonText, {onclick: () => {
          onclickCallBack();
        }})
      ])
    );
  }

}
