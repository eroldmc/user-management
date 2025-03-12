import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { User } from '../../../../core/models/user.interface';
import { UserService } from '../../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { UserListColumn } from '../../../../core/enums/user-list-column.enum';
import { SortDirection } from '../../../../core/enums/column-sort-direction.enum';

class MockUserService {
  private _users = signal<User[]>([
    { id: '1', uuid: 'uuid-1', firstname: 'John', lastname: 'Doe', fullname: 'John Doe', email: 'john.doe@example.com', phone: '1234567890', address: '123 Main St', city: 'Anytown', country: 'USA', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: '2', uuid: 'uuid-2', firstname: 'Jane', lastname: 'Doe', fullname: 'Jane Doe', email: 'jane.doe@example.com', phone: '0987654321', address: '456 Elm St', city: 'Othertown', country: 'USA', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' }
  ]);

  private _displayableColumns = signal(new Map<UserListColumn, boolean>([
    [UserListColumn.ID, true],
    [UserListColumn.FIRSTNAME, true],
    [UserListColumn.LASTNAME, true],
    [UserListColumn.EMAIL, true]
  ]));

  users = () => this._users();
  isLoading = () => false;
  totalItems = () => 2;
  nextPage = () => null;
  sortedColumn = () => new Map<UserListColumn, SortDirection>([[UserListColumn.ID, SortDirection.ASC]]);
  getAvailableColumns = () => Array.from(this._displayableColumns().keys());
  getDisplayedColumns = () => Array.from(this._displayableColumns())
    .filter(([_, isVisible]) => isVisible)
    .map(([column]) => column);
  errorOccurred = () => false;
  loadUsers = jasmine.createSpy('loadUsers');
  deleteUser = jasmine.createSpy('deleteUser');
  updateUser = jasmine.createSpy('updateUser');
  searchUsers = jasmine.createSpy('searchUsers');
  updateDisplayedColumns = jasmine.createSpy('updateDisplayedColumns');
}

class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(null)
    };
  }
}

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userService: MockUserService;
  let dialog: MockMatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useClass: MockUserService },
        { provide: MatDialog, useClass: MockMatDialog }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    dialog = TestBed.inject(MatDialog) as unknown as MockMatDialog;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call `searchUsers` when searching', () => {
    const input = fixture.nativeElement.querySelector('.search-input');
    input.value = 'John';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    expect(userService.searchUsers).toHaveBeenCalledWith('John');
  });

  it('should open dialog when `editUser` is called', () => {
    spyOn(dialog, 'open').and.callThrough();
    component.editUser('1');
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should call `deleteUser` when `deleteUser` is called', () => {
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(true)
    } as MatDialogRef<any>);
    component.deleteUser('1');
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });

  it('should return correct available columns', () => {
    expect(userService.getAvailableColumns()).toEqual([
      UserListColumn.ID, UserListColumn.FIRSTNAME, UserListColumn.LASTNAME, UserListColumn.EMAIL
    ]);
  });

  it('should return correct displayed columns', () => {
    expect(userService.getDisplayedColumns()).toEqual([
      UserListColumn.ID, UserListColumn.FIRSTNAME, UserListColumn.LASTNAME, UserListColumn.EMAIL
    ]);
  });

  it('should update displayed columns', () => {
    component.onColumnSelectionChange([UserListColumn.FIRSTNAME, UserListColumn.LASTNAME]);
    expect(userService.updateDisplayedColumns).toHaveBeenCalledWith([
      UserListColumn.FIRSTNAME, UserListColumn.LASTNAME
    ]);
  });
});
