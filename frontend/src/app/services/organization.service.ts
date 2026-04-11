import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/contact.model';
import { Organization } from '../models/organization.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private apiUrl = `${environment.apiUrl}/organizations`;

  constructor(private http: HttpClient) {}

  getAllOrganizations(
    search = '',
    industry = '',
  ): Observable<ApiResponse<Organization[]>> {
    let params = new HttpParams();

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (industry.trim()) {
      params = params.set('industry', industry.trim());
    }

    return this.http.get<ApiResponse<Organization[]>>(this.apiUrl, { params });
  }

  getOrganizationById(id: string): Observable<ApiResponse<Organization>> {
    return this.http.get<ApiResponse<Organization>>(`${this.apiUrl}/${id}`);
  }

  createOrganization(
    organization: Organization,
  ): Observable<ApiResponse<Organization>> {
    return this.http.post<ApiResponse<Organization>>(this.apiUrl, organization);
  }

  updateOrganization(
    id: string,
    organization: Organization,
  ): Observable<ApiResponse<Organization>> {
    return this.http.put<ApiResponse<Organization>>(
      `${this.apiUrl}/${id}`,
      organization,
    );
  }

  deleteOrganization(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
