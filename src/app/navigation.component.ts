import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div style="margin: 20px; display: flex; gap: 20px;">
      <button 
        routerLink="/shopping-list" 
        routerLinkActive="active-button" 
        pButton 
        type="button" 
        label="Shopping List"
      ></button>
      <button 
        routerLink="/api-shopping-list" 
        routerLinkActive="active-button" 
        pButton 
        type="button" 
        label="API Shopping List"
      ></button>
    </div>
  `,
  styles: [`
    .active-button {
      background-color: #4CAF50 !important;
    }
  `]
})
export class NavigationComponent {}