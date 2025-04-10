import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingService, ShoppingItem } from './services/shopping.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>API CRUD Shopping List</h2>
    <ul>
      <li *ngFor="let item of items">
        {{ item.name }} - Qty: {{ item.quantity }} - ₹{{ item.price }}
        <button (click)="deleteItem(item.id)">Delete</button>
      </li>
    </ul>

    <div>
      <input [(ngModel)]="newItem.name" placeholder="Item Name" />
      <input [(ngModel)]="newItem.quantity" type="number" placeholder="Quantity" />
      <input [(ngModel)]="newItem.price" type="number" placeholder="Price" />
      <button (click)="addItem()">Add</button>
    </div>
  `
})
export class ApiShoppingListComponent implements OnInit {
  items: ShoppingItem[] = [];
  newItem: ShoppingItem = { id: 0, name: '', quantity: 1, price: 0 };

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.shoppingService.getItems().subscribe(data => {
      this.items = data.slice(0, 5); // dummy data is big
    });
  }

  addItem() {
    this.shoppingService.addItem(this.newItem).subscribe(added => {
      this.items.push(added);
      this.newItem = { id: 0, name: '', quantity: 1, price: 0 };
    });
  }

  deleteItem(id: number) {
    this.shoppingService.deleteItem(id).subscribe(() => {
      this.items = this.items.filter(item => item.id !== id);
    });
  }
}
