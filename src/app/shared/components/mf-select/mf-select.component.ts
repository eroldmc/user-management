import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mf-select',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MatIcon],
  templateUrl: './mf-select.component.html',
  styleUrl: './mf-select.component.scss'
})
export class MfSelectComponent<T> {
  @Input() label: string = '';
  @Input() translateKey!: string;
  @Input() options: T[] = [];
  @Input() selected: T[] = [];
  @Input() multiple: boolean = false;
  @Output() selectedChange = new EventEmitter<T[]>();

  isOpen = signal(false);

  constructor(private translate: TranslateService) {

  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  toggleOption(option: T) {
    const updatedSelection = this.selected.includes(option)
      ? this.selected.filter(item => item !== option)
      : [...this.selected, option];

    this.selectedChange.emit(updatedSelection);
  }

  isSelected(option: T) {
    return this.selected.includes(option);
  }

  getTranslatedOption(option: T): string {
    return this.translate.instant(`${this.translateKey}.${(option as string).toUpperCase()}`);
  }
}
