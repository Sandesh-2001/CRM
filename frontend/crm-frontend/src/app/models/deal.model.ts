export type DealStage = 'Lead' | 'Contacted' | 'Proposal' | 'Won' | 'Lost';

export interface DealContact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  organizationId?: string;
  company?: string;
  status?: string;
}

export interface Deal {
  _id?: string;
  title: string;
  value: number;
  stage: DealStage;
  contactId: string;
  contact?: DealContact | null;
  assignedTo: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DealMetaResponse {
  success: boolean;
  stages: DealStage[];
  contacts: DealContact[];
  assignees: string[];
}
