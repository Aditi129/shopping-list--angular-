import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of, Observable } from 'rxjs';


export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})


export class ShoppingService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // dummy 

  constructor(private http: HttpClient) {}

  // Get items
  getItems(): Observable<ShoppingItem[]> {
    const mockItems: ShoppingItem[] = [
      
    ];
    return of(mockItems);
  }
  

  // Add  new item
  addItem(item: ShoppingItem): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(this.apiUrl, item);
  }

  // Update item
  updateItem(item: ShoppingItem): Observable<ShoppingItem> {
    return this.http.put<ShoppingItem>(`${this.apiUrl}/${item.id}`, item);
  }

  // Delete item
  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
