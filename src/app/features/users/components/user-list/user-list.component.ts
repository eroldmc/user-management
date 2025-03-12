/**
 * @description Ce composant permet d'afficher la liste des utilisateurs
 */

import { Component, inject, ElementRef, ViewChild, OnDestroy, signal, AfterViewInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { RouterModule } from '@angular/router';
import { UserListColumn } from '../../../../core/enums/user-list-column.enum';
import { SortDirection } from '../../../../core/enums/column-sort-direction.enum';
import { MatIcon } from '@angular/material/icon';
import { MfSelectComponent } from '../../../../shared/components/mf-select/mf-select.component';
import { TranslatePipe } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { User } from '../../../../core/models/user.interface';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIcon, MfSelectComponent, TranslatePipe, MatMenuModule, MatProgressBarModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements AfterViewInit, OnDestroy {
  // scrollTrigger est une référence à l'élément HTML qui déclenche le chargement des utilisateurs
  @ViewChild('scrollTrigger', { static: false }) scrollTrigger!: ElementRef;

  readonly userService = inject(UserService);
  readonly dialog = inject(MatDialog);

  // Observer pour gérer le scroll infini
  private _observer!: IntersectionObserver;
  private _mutationObserver!: MutationObserver;

  // Enumérations
  userListColumn = UserListColumn;
  sortDirection = SortDirection;

  isSearching = signal(false); // Signal pour indiquer si l'utilisateur est en train de rechercher

  constructor() {
    effect(() => {
      if (!this.userService.errorOccurred()) {
        setTimeout(() => this.setupIntersectionObserver(), 500);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.setupMutationObserver();
  }

  /**
 * @description MutationObserver pour vérifier si l'écran est rempli.
 */
  private setupMutationObserver(): void {
    this._mutationObserver = new MutationObserver(() => {
      this.checkScreenFill();
    });
    this._mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * @description Vérifie si l'écran est rempli pour charger plus d'utilisateurs.
   */
  private checkScreenFill(): void {
    if (this.isSearching()) return;

    const tbody = document.querySelector('.user-table tbody') as HTMLElement;
    const table = document.querySelector('.user-table') as HTMLElement;

    if (!tbody || !table) {
      return;
    }

    if (tbody.scrollHeight > table.clientHeight) {
      return;
    }

    if (this.userService.hasMoreData()) {
      this.userService.loadUsers();
    }
  }

  /**
   * @description Observer pour gérer le scroll infini.
   */
  setupIntersectionObserver(): void {
    const tbody = document.querySelector('.user-table tbody') as HTMLElement;

    if (!tbody) {
      return;
    }

    if (this._observer) {
      this._observer.disconnect(); // Évite d'attacher plusieurs observers
    }

    this._observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && this.userService.hasMoreData() && !this.isSearching() && !this.userService.isLoading()) {
        this.userService.loadUsers();
      }
    }, {
      root: tbody,
      rootMargin: '50px',
      threshold: 1.0
    });


    if (this.scrollTrigger) {
      this._observer.observe(this.scrollTrigger.nativeElement);
    }
  }

  /**
   * @description Recherche un utilisateur.
   */
  searchUser(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const searchValue = inputElement.value.trim();

    if (searchValue.length === 0) {
      this.isSearching.set(false);
      this.setupIntersectionObserver();
    } else {
      this.isSearching.set(true);
      this._observer.disconnect();
    }

    this.userService.searchUsers(searchValue);
  }

  /**
   * @description Ouvre le dialogue pour éditer un utilisateur.
   */
  editUser(id: string): void {
    const dialog = this.dialog.open(UserEditComponent, {
      width: 'auto',
      data: this.userService.users().find(user => user.id === id)
    });
    dialog.afterClosed().subscribe((value: User) => {
      if (!value) return;
      this.userService.updateUser(value);
    });
  }

  /**
   * @description Supprime un utilisateur.
   */
  deleteUser(id: string): void {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      width: 'auto',
      data: {
        title: 'USER_LIST.DELETE_USER',
        message: 'USER_LIST.DELETE_USER_CONFIRMATION'
      }
    });
    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.deleteUser(id);
      }
    });
  }

  /**
   * @description Met à jour les colonnes affichées.
   */
  onColumnSelectionChange(selectedColumns: UserListColumn[]): void {
    this.userService.updateDisplayedColumns(selectedColumns);
  }

  isScrolling() {
    // Not implemented
  }

  /**
   * @description Détruit les observers.
   */
  ngOnDestroy(): void {
    if (this._observer) {
      this._observer.disconnect();
    }
    if (this._mutationObserver) {
      this._mutationObserver.disconnect();
    }
  }
}