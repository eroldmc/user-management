import { Component, inject, model, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../../core/models/user.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MfButtonComponent } from '../../../../shared/components/mf-button/mf-button.component';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, MfButtonComponent, MatDialogModule, ReactiveFormsModule,MatError, MatInputModule, MatFormFieldModule,MatCardModule, TranslatePipe],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UserEditComponent>);
  readonly data = inject<User>(MAT_DIALOG_DATA)
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = new FormGroup({
      email: new FormControl(this.data.email, [Validators.required, Validators.email]),
      phone: new FormControl(this.data.phone, [Validators.required]),
      address: new FormControl(this.data.address, [Validators.required]),
      city: new FormControl(this.data.city, [Validators.required]),
      country: new FormControl(this.data.country, [Validators.required]),
    });
  }

  save(): void {
    if (this.userForm.valid) {
      this.dialogRef.close({...this.data, ...this.userForm.value});
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
