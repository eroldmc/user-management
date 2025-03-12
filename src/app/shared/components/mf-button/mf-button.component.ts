import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-mf-button',
  imports: [MatIcon],
  templateUrl: './mf-button.component.html',
  styleUrl: './mf-button.component.scss'
})
export class MfButtonComponent {
  @Input() type: 'primary' | 'secondary' | 'danger' | 'icon' = 'primary';

  @Input() icon?: string;

  @Input() label?: string;

  @Input() disabled: boolean = false;

  @Input() loading: boolean = false;

  @Output() clicked = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
