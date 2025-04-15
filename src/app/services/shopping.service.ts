import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ShoppingItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  // Convert JSONPlaceholder posts to ShoppingItems
  private mapToShoppingItem(post: any): ShoppingItem {
    return {
      id: post.id,
      name: post.title.substring(0, 20), // Use title as item name
      quantity: post.userId, // Use userId as quantity
      price: post.id * 10 // Generate  price based on ID
    };
  }

  getItems(): Observable<ShoppingItem[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(posts => posts.slice(0, 5).map(this.mapToShoppingItem)), // Only take first 5 posts
      catchError(() => of([])) // Fallback if API fails
    );
  }

  // JSONPlaceholder doesn't persist data, but returns a mock response
  addItem(item: ShoppingItem): Observable<ShoppingItem> {
    const mockPost = {
      title: item.name,
      body: `Quantity: ${item.quantity}, Price: ₹${item.price}`,
      userId: item.quantity,
      id: Math.floor(Math.random() * 1000) + 100 // Random ID
    };

    return this.http.post<any>(this.apiUrl, mockPost).pipe(
      map(response => this.mapToShoppingItem(response))
    );
  }

  updateItem(item: ShoppingItem): Observable<ShoppingItem> {
    const mockPost = {
      id: item.id,
      title: item.name,
      body: `Updated: Qty ${item.quantity}, Price ₹${item.price}`,
      userId: item.quantity
    };

    return this.http.put<any>(`${this.apiUrl}/${item.id}`, mockPost).pipe(
      map(response => this.mapToShoppingItem(response))
    );
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}