import { Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';
import { ApiShoppingListComponent } from './api-shopping-list.component';

export const routes: Routes = [
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'api-shopping-list', component: ApiShoppingListComponent },
  { path: '', redirectTo: 'shopping-list', pathMatch: 'full' },
  { path: '**', redirectTo: 'shopping-list' }
];