import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { ApiResponse } from '../../models/contact.model';
import { DashboardStats } from '../../models/dashboard.model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<ApiResponse<DashboardStats>>;
  maxRevenue = 1;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.stats$ = this.dashboardService.getDashboardStats().pipe(
      tap((response) => {
        const revenue = response.data?.monthlyRevenue ?? [];
        this.maxRevenue = revenue.length
          ? Math.max(...revenue.map((item) => item.value))
          : 1;
      }),
    );
  }
}
