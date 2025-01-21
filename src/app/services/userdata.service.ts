import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the User interface for typing
export interface User {
  id?: number; // Optional id
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserdataService {
  // Define the URL for JSON server
  url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  // Get users - returns an array of users
  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.url); // Ensure the response is of type User[]
  }

  // Add a new user
  addUsers(data: User): Observable<User> {
    return this.http.post<User>(this.url, data); 
  }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`); 
  }

  // Edit a user
  editUser(id: number, data: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, data); 
  }
}
