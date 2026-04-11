import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/contact.model';
import { Deal, DealMetaResponse, DealStage } from '../models/deal.model';
import { environment } from '../../environments/environment';

export interface DealQueryOptions {
  stage?: DealStage | '';
  search?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DealService {
  private readonly apiUrl = `${environment.apiUrl}/deals`;

  constructor(private http: HttpClient) {}

  getAllDeals(options: DealQueryOptions = {}): Observable<ApiResponse<Deal[]>> {
    let params = new HttpParams();

    if (options.stage) {
      params = params.set('stage', options.stage);
    }

    if (options.search?.trim()) {
      params = params.set('search', options.search.trim());
    }

    if (options.assignedTo) {
      params = params.set('assignedTo', options.assignedTo);
    }

    if (options.startDate) {
      params = params.set('startDate', options.startDate);
    }

    if (options.endDate) {
      params = params.set('endDate', options.endDate);
    }

    return this.http.get<ApiResponse<Deal[]>>(this.apiUrl, { params });
  }

  getDealMeta(): Observable<DealMetaResponse> {
    return this.http.get<DealMetaResponse>(`${this.apiUrl}/meta`);
  }

  getDealById(id: string): Observable<ApiResponse<Deal>> {
    return this.http.get<ApiResponse<Deal>>(`${this.apiUrl}/${id}`);
  }

  createDeal(deal: Deal): Observable<ApiResponse<Deal>> {
    return this.http.post<ApiResponse<Deal>>(this.apiUrl, deal);
  }

  updateDeal(id: string, deal: Deal): Observable<ApiResponse<Deal>> {
    return this.http.put<ApiResponse<Deal>>(`${this.apiUrl}/${id}`, deal);
  }

  deleteDeal(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
