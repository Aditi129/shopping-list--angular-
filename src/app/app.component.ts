import { Component } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShoppingListComponent],
  template: `<app-shopping-list></app-shopping-list>`
})
export class AppComponent {}