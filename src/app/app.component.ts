/*import { Component } from '@angular/core';
import { ShoppingListComponent } from './shopping-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ShoppingListComponent],
  template: `<app-shopping-list></app-shopping-list>`
})
export class AppComponent {}*/


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {}