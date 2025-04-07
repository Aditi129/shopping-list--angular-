import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importing PrimeNG components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    TableModule, 
    ButtonModule, 
    InputTextModule, 
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="container">
      <h1>SHOPPING LIST</h1>
      <hr>
      
      <p-toast></p-toast>
      
      <div class="add-item-form">
        <span class="p-float-label">
          <input 
            id="item-name" 
            type="text" 
            pInputText 
            [(ngModel)]="newItem.name" 
            required 
            #itemName="ngModel">
          <label for="item-name">Item Name</label>
        </span>
        <div *ngIf="itemName.invalid && (itemName.dirty || itemName.touched)" class="error-message">
          Item name is required
        </div>
        
        <p-inputNumber 
          [(ngModel)]="newItem.quantity" 
          placeholder="Quantity" 
          [min]="1"
          showButtons
          buttonLayout="horizontal"
          inputId="quantity"
          [style]="{'width': '150px'}">
        </p-inputNumber>
        
        <p-inputNumber 
          [(ngModel)]="newItem.price" 
          placeholder="Price" 
          [min]="0.01"
          [minFractionDigits]="2"
          mode="currency" 
          currency="INR"
          locale="en-IN"
          [style]="{'width': '150px'}">
        </p-inputNumber>
        
        <p-button label="Add Item" icon="pi pi-plus" (onClick)="addItem()"></p-button>
      </div>
      
      <p-table [value]="items" [tableStyle]="{'min-width': '50rem'}">
        <ng-template pTemplate="header">
          <tr>
            <th>S.no</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item let-i="rowIndex">
          <tr>
            <td>{{ i + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>
              <p-inputNumber 
                [(ngModel)]="item.quantity" 
                [min]="1"
                [showButtons]="true"
                (onInput)="updateTotals()"
                [style]="{'width': '100px'}">
              </p-inputNumber>
            </td>
            <td>₹{{ item.price }}</td>
            <td>₹{{ (item.quantity * item.price).toFixed(2) }}</td>
            <td>
              <p-button 
                icon="pi pi-trash" 
                severity="danger" 
                (onClick)="deleteItem(item.id)">
              </p-button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="footer">
          <tr>
            <td colspan="4" style="text-align:right">Total Price:</td>
            <td colspan="2">₹{{ calculateTotal().toFixed(2) }}</td>
          </tr>
        </ng-template>
      </p-table>
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
      display:block;
      width:100%;
      border: 1px solid black;
      margin-bottom: 10px 0px;
    }
    
    .add-item-form {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      gap: 10px;
      align-items: flex-start;
    }
    
    .error-message {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }
    
    :host ::ng-deep .p-button {
      margin-left: 10px;
    }
    
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f8f9fa;
      color: #212529;
      font-weight: bold;
    }
    
    :host ::ng-deep .p-inputnumber-button-down, 
    :host ::ng-deep .p-inputnumber-button-up {
      height: 1.5rem !important;
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
  
  constructor(private messageService: MessageService) {}
  
  addItem(): void {
    if (this.newItem.name && this.newItem.quantity > 0 && this.newItem.price > 0) {
      this.items.push({
        id: this.nextId++,
        name: this.newItem.name,
        quantity: this.newItem.quantity,
        price: this.newItem.price
      });
      
      // Show success message
      this.messageService.add({
        severity: 'success',
        summary: 'Item Added',
        detail: `${this.newItem.name} has been added to your shopping list`
      });
      
      // Reset the form
      this.newItem = {
        id: 0,
        name: '',
        quantity: 1,
        price: 0
      };
    } else {
      // Show error message
      this.messageService.add({
        severity: 'error',
        summary: 'Failed to Add Item',
        detail: 'Please fill all fields correctly'
      });
    }
  }
  
  deleteItem(id: number): void {
    const itemToDelete = this.items.find(item => item.id === id);
    this.items = this.items.filter(item => item.id !== id);
    
    if (itemToDelete) {
      this.messageService.add({
        severity: 'info',
        summary: 'Item Removed',
        detail: `${itemToDelete.name} has been removed from your shopping list`
      });
    }
  }
  
  updateTotals(): void {
    // No need to do anything here as Angular's data binding will update the view
  }
  
  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }
}

//main functionality file