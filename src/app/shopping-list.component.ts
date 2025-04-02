import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>SHOPPING LIST</h1>
      <hr>
      
      <div class="add-item-form">
        <input type="text" [(ngModel)]="newItem.name" placeholder="Item Name">
        <input type="number" [(ngModel)]="newItem.quantity" placeholder="Quantity" min="1">
        <input type="number" [(ngModel)]="newItem.price" placeholder="Price" min="0" step="0.01">
        <button (click)="addItem()" class="add-btn">Add Item</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>S.no</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items; let i = index">
            <td>{{ i + 1 }}</td>
            <td>
              {{ item.name }}
              <button class="delete-btn" (click)="deleteItem(item.id)">Delete</button>
            </td>
            <td>
              <input type="number" [(ngModel)]="item.quantity" min="1" class="quantity-input" (change)="updateTotals()">
            </td>
            <td>₹{{ item.price }}</td>
            <td>₹{{ (item.quantity * item.price).toFixed(2) }}</td>
          </tr>
          <tr class="total-row">
            <td>Total Price</td>
            <td></td>
            <td></td>
            <td></td>
            <td>₹{{ calculateTotal().toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container {
      font-family: Arial, sans-serif;
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f0ffff;
    }
    
    h1 {
      text-align: center;
      font-size: 28px;
      margin-bottom: 10px;
    }

    hr {
      border: 1px solid black;
      margin-bottom: 30px;
    }
    
    .add-item-form {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    
    input {
      padding: 8px;
      border: 1px solid #aaa;
      border-radius: 0;
    }
    
    .add-btn {
      padding: 8px 16px;
      background-color: #f0f0f0;
      color: black;
      border: 1px solid #aaa;
      cursor: pointer;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
    }
    
    th, td {
      padding: 12px;
      border: 1px solid black;
      background-color: #fefbd8; /* cream color for cells */
    }
    
    th {
      font-weight: bold;
      text-align: center;
    }
    
    .delete-btn {
      background-color: #f0f0f0;
      border: 1px solid #aaa;
      padding: 2px 8px;
      margin-left: 10px;
      cursor: pointer;
    }
    
    .quantity-input {
      width: 50px;
      text-align: center;
      padding: 4px;
    }
    
    .total-row td {
      font-weight: bold;
    }
  `]
})
export class ShoppingListComponent {
  items: ShoppingItem[] = [
    { id: 1, name: 'Books', quantity: 1, price: 7 },
    { id: 2, name: 'Juice', quantity: 1, price: 3 },
    { id: 3, name: 'Shoes', quantity: 1, price: 10 },
    { id: 4, name: 'Bananas', quantity: 1, price: 2 },
    { id: 5, name: 'Iron', quantity: 1, price: 7 }
  ];
  
  newItem: ShoppingItem = {
    id: 0,
    name: '',
    quantity: 1,
    price: 0
  };
  
  nextId = 6;
  
  addItem(): void {
    if (this.newItem.name && this.newItem.quantity > 0 && this.newItem.price >= 0) {
      this.items.push({
        id: this.nextId++,
        name: this.newItem.name,
        quantity: this.newItem.quantity,
        price: this.newItem.price
      });
      
      // Reset the form
      this.newItem = {
        id: 0,
        name: '',
        quantity: 1,
        price: 0
      };
    }
  }
  
  deleteItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }
  
  updateTotals(): void {
    // This function is called when quantity inputs change
    // No need to do anything here as Angular's data binding will update the view
  }
  
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }
}