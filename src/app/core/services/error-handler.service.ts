import { inject, Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private dialog = inject(MatDialog);
  private translate = inject(TranslateService);

  errorMessage = signal<string | null>(null);

  handleError(error: HttpErrorResponse) {
    console.error(error);
    let errorMessage = this.translate.instant('ERROR.UNKNOWN');
    if (error.error instanceof ErrorEvent) {
      errorMessage = this.translate.instant('ERROR.CLIENT');
    } else {
      switch (error.status) {
        case 400:
          errorMessage = this.translate.instant('ERROR.BAD_REQUEST');
          break;
        case 401:
          errorMessage = this.translate.instant('ERROR.UNAUTHORIZED');
          break;
        case 403:
          errorMessage = this.translate.instant('ERROR.FORBIDDEN');
          break;
        case 404:
          errorMessage = this.translate.instant('ERROR.NOT_FOUND');
          break;
        case 500:
          errorMessage = this.translate.instant('ERROR.SERVER');
          break;
        case 666:
          errorMessage = this.translate.instant('ERROR.RANDOM');
          break;
        default:
          errorMessage = this.translate.instant('ERROR.UNKNOWN');
          break;
      }
    }

    this.errorMessage.set(errorMessage);

    this.dialog.open(ErrorDialogComponent, {
      data: { message: errorMessage },
      width: '400px'
    });

    return throwError(() => new Error(errorMessage));
  }

  dismissError(): void {
    this.errorMessage.set(null);
  }
}
