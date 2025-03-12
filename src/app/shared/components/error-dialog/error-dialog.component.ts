import { Component, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { MfButtonComponent } from '../mf-button/mf-button.component';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-error-dialog',
  imports: [TranslatePipe, MatDialogModule, MfButtonComponent],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  private errorHandlerService = inject(ErrorHandlerService);
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  close(): void {
    this.errorHandlerService.dismissError();
    this.dialogRef.close();
  }
}
