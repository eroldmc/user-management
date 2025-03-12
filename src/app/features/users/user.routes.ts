import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';

export const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    children: [
      {
        path: 'users',
        loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
      }
    ]
  }
];