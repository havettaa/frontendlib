import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ResourceManagementState } from './state/resourceManagementState';
import { ResourceManagementApi } from './api/resourceManagementApi';
import { ResourceManagementFacade } from './facade/resourceManagementFacade';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ResourceManagementState, ResourceManagementFacade, ResourceManagementApi],
  
})
export class ResourceManagementModule { }
