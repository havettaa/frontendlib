import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RichTextComponent } from './richText.component';
// import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RichTextComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // QuillModule.forRoot()
  ],
  exports: [RichTextComponent]
})
export class RichTextModule { }
