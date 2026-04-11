import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/contact.model';
import {
  Activity,
  ActivityMetaResponse,
  ActivityStatus,
  ActivityType,
} from '../models/activity.model';

export interface ActivityQueryOptions {
  status?: ActivityStatus | '';
  type?: ActivityType | '';
}

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private readonly apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getAllActivities(
    options: ActivityQueryOptions = {},
  ): Observable<ApiResponse<Activity[]>> {
    let params = new HttpParams();

    if (options.status) {
      params = params.set('status', options.status);
    }

    if (options.type) {
      params = params.set('type', options.type);
    }

    return this.http.get<ApiResponse<Activity[]>>(this.apiUrl, { params });
  }

  getActivityMeta(): Observable<ActivityMetaResponse> {
    return this.http.get<ActivityMetaResponse>(`${this.apiUrl}/meta`);
  }

  createActivity(activity: Activity): Observable<ApiResponse<Activity>> {
    return this.http.post<ApiResponse<Activity>>(this.apiUrl, activity);
  }

  updateActivity(
    id: string,
    activity: Activity,
  ): Observable<ApiResponse<Activity>> {
    return this.http.put<ApiResponse<Activity>>(
      `${this.apiUrl}/${id}`,
      activity,
    );
  }

  markCompleted(id: string): Observable<ApiResponse<Activity>> {
    return this.http.patch<ApiResponse<Activity>>(
      `${this.apiUrl}/${id}/complete`,
      {},
    );
  }

  deleteActivity(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
