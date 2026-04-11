import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, ApiResponse } from '../models/contact.model';
import { environment } from '../../environments/environment';

export interface ContactQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/contacts`;

  constructor(private http: HttpClient) {}

  getAllContacts(
    options: ContactQueryOptions = {},
  ): Observable<ApiResponse<Contact[]>> {
    let params = new HttpParams();
    if (options.page) {
      params = params.set('page', String(options.page));
    }
    if (options.limit) {
      params = params.set('limit', String(options.limit));
    }
    if (options.search) {
      params = params.set('search', options.search);
    }
    if (options.status) {
      params = params.set('status', options.status);
    }
    if (options.organization) {
      params = params.set('organization', options.organization);
    }
    if (options.startDate) {
      params = params.set('startDate', options.startDate);
    }
    if (options.endDate) {
      params = params.set('endDate', options.endDate);
    }
    return this.http.get<ApiResponse<Contact[]>>(this.apiUrl, { params });
  }

  getContactById(id: string): Observable<ApiResponse<Contact>> {
    return this.http.get<ApiResponse<Contact>>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: Contact): Observable<ApiResponse<Contact>> {
    return this.http.post<ApiResponse<Contact>>(this.apiUrl, contact);
  }

  updateContact(
    id: string,
    contact: Contact,
  ): Observable<ApiResponse<Contact>> {
    return this.http.put<ApiResponse<Contact>>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
