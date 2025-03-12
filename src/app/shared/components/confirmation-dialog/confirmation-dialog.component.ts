import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MfButtonComponent } from '../mf-button/mf-button.component';

interface ConfirmationDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [TranslatePipe, MatDialogModule, MfButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  private dialog = inject(MatDialogRef<ConfirmationDialogComponent>)

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }

  confirm(): void {
    this.dialog.close(true);
  }

  cancel(): void {
    this.dialog.close(false);
  }
}
