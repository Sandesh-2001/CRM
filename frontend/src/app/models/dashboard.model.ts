export interface MonthlyRevenuePoint {
  month: string;
  value: number;
}

export interface DashboardStats {
  totalDeals: number;
  wonDeals: number;
  lostDeals: number;
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenuePoint[];
  wonRate: number;
  lostRate: number;
}
