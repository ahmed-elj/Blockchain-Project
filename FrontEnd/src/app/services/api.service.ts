import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, option?: any): Observable<T> {
    return this.http.get<T>(url, option) as Observable<T>;
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body) as Observable<T>;
  }
}
