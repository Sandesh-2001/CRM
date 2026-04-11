export type ActivityType = 'call' | 'meeting' | 'task';
export type ActivityStatus = 'pending' | 'completed';
export type ActivityEntityType = 'contact' | 'deal';

export interface ActivityRelatedTo {
  entityType: ActivityEntityType;
  entityId: string;
}

export interface ActivityRelatedEntity {
  entityType: ActivityEntityType;
  entityId: string;
  label: string;
  sublabel?: string;
}

export interface Activity {
  _id?: string;
  type: ActivityType;
  date: string;
  status: ActivityStatus;
  relatedTo: ActivityRelatedTo;
  relatedEntity?: ActivityRelatedEntity | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ActivityMetaItem {
  _id: string;
  label: string;
  sublabel?: string;
}

export interface ActivityMetaResponse {
  success: boolean;
  contacts: ActivityMetaItem[];
  deals: ActivityMetaItem[];
}
