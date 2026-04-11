import { Organization } from './organization.model';
import { DealStage } from './deal.model';
import { ActivityStatus, ActivityType } from './activity.model';

export interface Contact {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organizationId?: string;
  organization?: Organization | null;
  company?: string;
  position?: string;
  status?: 'lead' | 'prospect' | 'customer' | 'inactive';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  statusCounts?: Record<string, number>;
  organizations?: Organization[];
  totalValue?: number;
  stageCounts?: Record<DealStage, number>;
  stages?: DealStage[];
  contacts?: { _id: string; label: string; sublabel?: string }[];
  deals?: { _id: string; label: string; sublabel?: string }[];
  status?: ActivityStatus;
  type?: ActivityType;
}
