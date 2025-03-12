/**
 * @description Ce service permet de charger des utilisateurs depuis JSON Server.
 */
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { API_URL } from '../../../core/config/api.token';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { JsonServerResponse } from '../../../core/models/json-server-response.model';
import { User } from '../../../core/models/user.interface';
import { UserListColumn } from '../../../core/enums/user-list-column.enum';
import { SortDirection } from '../../../core/enums/column-sort-direction.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${inject(API_URL)}/users`;
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);
  private usersTemp: User[] = [];

  // Signaux
  private _users = signal<User[]>([]);
  private _isLoading = signal(false);
  private _nextPage = signal<number | null>(1);
  private _scrollVisible = signal(false);
  private _totalItems = signal(0);
  private _hasMoreData = signal(true);
  private _errorOccurred = signal(false);

  // Ajoute un signal pour les colonnes affichées
  private _displayableColumns = signal<Map<UserListColumn, boolean>>(new Map([
    [UserListColumn.ID, true],
    [UserListColumn.LASTNAME, false],
    [UserListColumn.FIRSTNAME, false],
    [UserListColumn.FULLNAME, true],
    [UserListColumn.EMAIL, true],
    [UserListColumn.CITY, false],
    [UserListColumn.COUNTRY, false]
  ]));
  // Ajoute un signal pour les colonnes triées
  private _sortedColumn = signal<Map<UserListColumn, SortDirection>>(new Map([
    [UserListColumn.ID, SortDirection.ASC],
    [UserListColumn.LASTNAME, SortDirection.ASC],
    [UserListColumn.FIRSTNAME, SortDirection.ASC],
    [UserListColumn.FULLNAME, SortDirection.ASC],
    [UserListColumn.EMAIL, SortDirection.ASC],
    [UserListColumn.CITY, SortDirection.ASC],
    [UserListColumn.COUNTRY, SortDirection.ASC]
  ]));

  // Expose les signaux en tant qu'observables
  users: Signal<User[]> = computed(() => this._users());
  isLoading: Signal<boolean> = computed(() => this._isLoading());
  totalItems: Signal<number> = computed(() => this._totalItems());
  nextPage: Signal<number | null> = computed(() => this._nextPage());
  scrollVisible: Signal<boolean> = computed(() => this._scrollVisible());
  hasMoreData: Signal<boolean> = computed(() => this._hasMoreData());
  displayableColumns: Signal<Map<UserListColumn, boolean>> = computed(() => this._displayableColumns());
  sortedColumn: Signal<Map<UserListColumn, SortDirection>> = computed(() => this._sortedColumn());
  errorOccurred: Signal<boolean> = computed(() => this._errorOccurred());

  /**
   * @description Charge les utilisateurs depuis JSON Server.
   */
  loadUsers(): void {
    if (this._isLoading() || !this._hasMoreData() || this._nextPage() === null) return;

    this._isLoading.set(true);

    const currentPage = this._nextPage();

    this.http.get<JsonServerResponse<User>>(`${this.apiUrl}?_page=${currentPage}`)
      .pipe(
        map(response => ({
          ...response,
          data: response.data.map((userData) => new User(userData))
        })),
        catchError(err => {
          this._errorOccurred.set(true);
          this._isLoading.set(false);
          this.errorHandler.handleError(err);
          return of(null);
        })
      )
      .subscribe(response => {
        if(!response) return;
        if (!response.data.length) {
          this._hasMoreData.set(false);
        } else {
          // Simule un délai de chargement
          setTimeout(() => {
            this._users.update(currentUsers => [...currentUsers, ...response.data]);
            this.usersTemp = [...this._users()];

            this._totalItems.set(response.items);
            this._nextPage.set(response.next);
            this._isLoading.set(false);
            this._errorOccurred.set(false);
          }, Math.floor(Math.random() * 1000));
        }
      }
    );
  }


  /**
   * @description Trie les utilisateurs par ordre croissant ou décroissant selon la colonne spécifiée.
   */
  sortUsers<T extends keyof User>(key: T, order: SortDirection): void {
    const sortedUsers = [...this._users()].sort((a, b) => {
      if (a[key] > b[key]) return order === SortDirection.ASC ? 1 : -1;
      if (a[key] < b[key]) return order === SortDirection.ASC ? -1 : 1;
      return 0;
    });

    this._users.set(sortedUsers);

    // Met à jour la colonne triée et réinitialise les autres colonnes
    this._sortedColumn.update(columns => {
      const newMap = new Map(columns);
      newMap.set(key as UserListColumn, order === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);

      newMap.forEach((_, col) => {
        if (col !== key) {
          newMap.set(col, SortDirection.ASC);
        }
      });

      return newMap;
    });
  }

  /**
   * @description Récupère les colonnes affichables
   */
  getAvailableColumns(): UserListColumn[] {
    return Array.from(this._displayableColumns().keys());
  }

  /**
   * @description Récupère les colonnes affichées
   */
  getDisplayedColumns(): UserListColumn[] {
    return Array.from(this._displayableColumns())
      .filter(([_, isVisible]) => isVisible)
      .map(([column]) => column);
  }

  /**
   * @description Met à jour les colonnes affichées
   */
  updateDisplayedColumns(selectedColumns: UserListColumn[]): void {
    const newMap = new Map<UserListColumn, boolean>();
    this._displayableColumns().forEach((_, key) => {
      newMap.set(key, selectedColumns.includes(key));
    });
    this._displayableColumns.set(newMap);
  }

  /**
   * @description Recherche un utilisateur par nom
   */
  searchUsers(name: string): void {
    if (!name.trim()) {
      this._users.set([...this.usersTemp]);
      return;
    }

    const regex = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]*$/;
    if (!regex.test(name)) return;

    const searchTerm = name.toLowerCase();

    const filteredUsers = this.usersTemp.filter(user =>
      user.fullname.toLowerCase().includes(searchTerm)
    );
    this._users.set(filteredUsers);
  }

  /**
   * @description Met à jour un utilisateur
   */
  updateUser(user: User): void {
    this._isLoading.set(true);
    this.http.put<User>(`${this.apiUrl}/${user.id}`, user)
      .pipe(
        map(() => user),
        catchError(err => {
          this._isLoading.set(false);
          this._errorOccurred.set(true);
          this.errorHandler.handleError(err);
          return of(null);
        })
      )
      .subscribe(() => {
        this._users.update(users => users.map(u => u.id === user.id ? user : u));
        this.usersTemp = [...this._users()];
        this._isLoading.set(false);
        this._errorOccurred.set(false);
      });
  }


  /**
   * @description Supprime un utilisateur
   */
  deleteUser(id: string): void {
    this._isLoading.set(true);
    this.http.delete(`${this.apiUrl}/${id}`).
      pipe(
        catchError(err => {
          this._isLoading.set(false);
          this._errorOccurred.set(true);
          this.errorHandler.handleError(err);
          return of(null);
        })
      )
      .subscribe(() => {
        this._users.update(users => users.filter(user => user.id !== id));
        this.usersTemp = [...this._users()];
        this._isLoading.set(false);
        this._totalItems.set(this._totalItems() - 1);
        this._errorOccurred.set(false);
      });
  }
}