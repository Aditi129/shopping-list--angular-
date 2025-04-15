import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ShoppingService } from './services/shopping.service';

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
    ToastModule,
    DialogModule
  ],
  providers: [MessageService],
  template: `
    <div class="container">
      <h1>SHOPPING LIST</h1>
      <hr>
      
      <p-toast></p-toast>
      
      <div style="text-align: right; margin-bottom: 1rem;">
        <button pButton type="button" label="Add Item" icon="pi pi-plus" (click)="displayAddDialog = true"></button>
      </div>
      
      <p-table
        #dt
        [value]="items"
        dataKey="id"
        editMode="cell"
        [tableStyle]="{'min-width': '50rem'}"
        [paginator]="true"
        [rows]="5"
        [rowsPerPageOptions]="[3,4,10]"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} items"
      >
        <ng-template pTemplate="header">
          <tr>
            <th style="width: 5%">Sr. no</th>
            <th style="width: 25%">Item</th>
            <th style="width: 20%">Quantity</th>
            <th style="width: 20%">Price</th>
            <th style="width: 20%">Total</th>
            <th style="width: 10%">Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item let-i="rowIndex">
          <tr>
            <td>{{ i + 1 }}</td>
            <td pEditableColumn (click)="saveOriginalValue(item, 'name')">
              <p-cellEditor>
                <ng-template pTemplate="input">
                  <input pInputText type="text" [(ngModel)]="item.name" required style="width:100%" 
                         (blur)="onBlur(item, 'name')" (click)="$event.stopPropagation()">
                </ng-template>
                <ng-template pTemplate="output">
                  {{ item.name }}
                </ng-template>
              </p-cellEditor>
            </td>
            <td pEditableColumn (click)="saveOriginalValue(item, 'quantity')">
              <p-cellEditor>
                <ng-template pTemplate="input">
                  <p-inputNumber [(ngModel)]="item.quantity" [min]="1" [showButtons]="true" (onInput)="updateTotals()"
                                (blur)="onBlur(item, 'quantity')" (click)="$event.stopPropagation()"></p-inputNumber>
                </ng-template>
                <ng-template pTemplate="output">
                  {{ item.quantity }}
                </ng-template>
              </p-cellEditor>
            </td>
            <td pEditableColumn (click)="saveOriginalValue(item, 'price')">
              <p-cellEditor>
                <ng-template pTemplate="input">
                  <p-inputNumber [(ngModel)]="item.price" [min]="0.01" [minFractionDigits]="2" mode="currency" currency="INR" (onInput)="updateTotals()"
                                (blur)="onBlur(item, 'price')" (click)="$event.stopPropagation()"></p-inputNumber>
                </ng-template>
                <ng-template pTemplate="output">
                  ₹{{ item.price }}
                </ng-template>
              </p-cellEditor>
            </td>
            <td>₹{{ (item.quantity && item.price) ? (item.quantity * item.price).toFixed(2) : '0.00' }}</td>
            <td>
              <button pButton pRipple type="button" icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" (click)="deleteItem(item.id)"></button>
            </td>
          </tr>
        </ng-template>
        <ng-template pTemplate="footer">
          <tr>
            <td colspan="4" style="text-align:right; font-weight: bold;">Total Price:</td>
            <td colspan="2">₹{{ calculateTotal().toFixed(2) }}</td>
          </tr>
        </ng-template>
      </p-table>
      
      <p-dialog header="Add New Item" [(visible)]="displayAddDialog" [modal]="true" [style]="{width: '400px'}" [draggable]="false" [resizable]="false" [baseZIndex]="10000">
        <div class="p-fluid">
          <div class="field" style="margin-bottom: 1rem;">
            <label for="name">Item Name</label>
            <input id="name" type="text" pInputText [(ngModel)]="newItem.name" required>
          </div>
          <div class="field" style="margin-bottom: 1rem;">
            <label for="quantity">Quantity</label>
            <p-inputNumber id="quantity" [(ngModel)]="newItem.quantity" [min]="1" [showButtons]="true"></p-inputNumber>
          </div>
          <div class="field" style="margin-bottom: 1rem;">
            <label for="price">Price</label>
            <p-inputNumber id="price" [(ngModel)]="newItem.price" [min]="0.01" [minFractionDigits]="2" mode="currency" currency="INR"></p-inputNumber>
          </div>
        </div>
        <ng-template pTemplate="footer">
          <button pButton pRipple label="Cancel" icon="pi pi-times" class="p-button-text" (click)="displayAddDialog = false"></button>
          <button pButton pRipple label="Add" icon="pi pi-check" (click)="addItem()"></button>
        </ng-template>
      </p-dialog>
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
      display: block;
      width: 100%;
      border: 1px solid black;
      margin-bottom: 20px;
    }
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background-color: #f8f9fa;
      color: #212529;
      font-weight: bold;
    }
    :host ::ng-deep .p-button.p-button-icon-only {
      width: 2.5rem;
    }
  `]
})
export class ShoppingListComponent implements OnInit {
  items: ShoppingItem[] = [];
  newItem: ShoppingItem = { id: 0, name: '', quantity: 1, price: 0 };
  displayAddDialog = false;
  private originalValues: Map<number, Map<string, any>> = new Map();

  constructor(
    private messageService: MessageService,
    private shoppingService: ShoppingService  
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.shoppingService.getItems().subscribe({
      next: (data) => {
        this.items = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load items'
        });
      }
    });
  }

  saveOriginalValue(item: ShoppingItem, field: keyof ShoppingItem): void {
    if (!this.originalValues.has(item.id)) {
      this.originalValues.set(item.id, new Map());
    }
    const fieldMap = this.originalValues.get(item.id);
    if (fieldMap && !fieldMap.has(field)) {
      fieldMap.set(field, item[field]);
    }
  }

  onBlur(item: ShoppingItem, field: keyof ShoppingItem): void {
    const fieldMap = this.originalValues.get(item.id);
    const originalValue = fieldMap?.get(field);

    if (field === 'name' && (!item.name || item.name.trim() === '')) {
        item.name = originalValue;
        return;
    }
    if (field === 'quantity' && item.quantity < 1) {
        item.quantity = originalValue;
        return;
    }
    if (field === 'price' && item.price < 0.01) {
        item.price = originalValue;
        return;
    }

    this.shoppingService.updateItem(item).subscribe({
        next: () => {
            this.messageService.add({
                severity: 'success',
                summary: 'Item Updated',
                detail: `${field} updated successfully`
            });
        },
        error: () => {
            if (fieldMap) {
              (item as any)[field] = originalValue;

            }
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update item'
            });
        }
    });

    if (fieldMap) {
        fieldMap.delete(field);
        if (fieldMap.size === 0) this.originalValues.delete(item.id);
    }
}

  addItem(): void {
    if (!this.newItem.name || this.newItem.quantity <= 0 || this.newItem.price <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all fields correctly'
      });
      return;
    }

    const tempId = Math.max(0, ...this.items.map(i => i.id)) + 1;
    const itemToAdd = { ...this.newItem, id: tempId };

    this.shoppingService.addItem(itemToAdd).subscribe({
      next: (response) => {
        this.items = [...this.items, { ...response, id: tempId }];
        this.messageService.add({
          severity: 'success',
          summary: 'Item Added',
          detail: `${response.name} has been added`
        });
        this.newItem = { id: 0, name: '', quantity: 1, price: 0 };
        this.displayAddDialog = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add item'
        });
      }
    });
  }

  deleteItem(id: number): void {
    this.shoppingService.deleteItem(id).subscribe({
      next: () => {
        const itemToDelete = this.items.find(item => item.id === id);
        this.items = this.items.filter(item => item.id !== id);
        this.messageService.add({
          severity: 'info',
          summary: 'Item Removed',
          detail: `${itemToDelete?.name} has been removed`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete item'
        });
      }
    });
  }

  updateTotals(): void {
    this.items = [...this.items];
  }

  calculateTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }
}