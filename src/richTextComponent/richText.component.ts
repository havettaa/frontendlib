import { Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
// import Quill from 'quill';
import { QuillConfiguration } from './defaultQuillSettings';

@Component({
  selector: 'richText',
  templateUrl: './richText.component.html',
  styleUrls: ['./richText.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RichTextComponent),
    multi: true
  }]
})
export class RichTextComponent implements OnInit, OnChanges {
  @Input() model: string;
  @Input() isDebug: boolean;
  @Input() config: any;
  @Output() changed: EventEmitter<any> = new EventEmitter();

  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;
  @Input() quill: object;//Quill;
  editor: any;
  defaultConfig = QuillConfiguration;

  private htmlRegex = /<\/?[a-z][\s\S]*>/i;

  constructor() {

  }
  ngOnInit(): void {
    let editor = this.container.nativeElement.querySelector('#editor');
    
    // Please set this instance of the object from outside of the class
    //this.editor = new Quill(editor, { theme: 'snow' })
    
    this.editor.on('editor-change', (eventName, ...args) => {
      this.changed.emit(this.getQuillText());
    })

    if (this.model)
      this.fillQuill(this.model);

    if (this.isDebug == undefined)
      this.isDebug = false;
    this.config = this.config ?? this.defaultConfig;

  }

  ngOnChanges(): void {
    if (this.editor) {
      this.fillQuill(this.model);
    }
  }

  public insertTextOnCursorPosition(text: string) {
    var selection = this.editor.getSelection();
    if (selection) {
      this.editor.insertText(selection.index, text);
    }
  }

  private fillQuill(text: string): void {
    if (this.htmlRegex.test(this.model)) {
      this.editor.root.innerHTML = this.model;
    }
    else {
      this.editor.root.innerText = this.model;
    }
  }

  private getQuillText(): string {
    return this.editor.root.innerHTML
  }
}
