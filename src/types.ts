export type UserRole = "super_admin" | "admin" | "operator" | "client" | "sales";

export type CampaignStatus =
  | "draft"
  | "briefing_pending"
  | "ready_to_submit"
  | "submitted"
  | "processing"
  | "internal_review"
  | "client_review"
  | "revision_requested"
  | "approved"
  | "delivered"
  | "failed"
  | "cancelled";

export type AssetType = "image" | "video" | "copy" | "caption" | "script" | "package";

export type AssetStatus =
  | "generated"
  | "internal_approved"
  | "internal_rejected"
  | "visible_to_client"
  | "client_approved"
  | "client_rejected"
  | "revision_requested"
  | "final";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  legalName?: string;
  segment: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  city?: string;
  state?: string;
  brandTone?: string;
  brandGuidelines?: any;
  restrictions?: any;
  logoUrl?: string;
  status: "active" | "inactive";
  planId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  creativeLimit: number;
  videoLimit: number;
  revisionLimit: number;
  priorityLevel: number;
  deliverySlaHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  clientId: string;
  createdBy: string;
  name: string;
  goal: string;
  offer: string;
  audience: string;
  channel: string;
  formats: string[];
  priority: "low" | "medium" | "high";
  briefing: any;
  status: CampaignStatus;
  dueDate?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: string;
  campaignId: string;
  jobId?: string;
  assetType: AssetType;
  format: string;
  title?: string;
  fileUrl?: string;
  previewUrl?: string;
  textContent?: string;
  metadata?: any;
  versionNumber: number;
  parentAssetId?: string;
  isVisibleToClient: boolean;
  isFinal: boolean;
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  campaignId: string;
  assetId?: string;
  authorUserId: string;
  authorType: "internal" | "client";
  feedbackType: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "archived";
  createdAt: string;
  updatedAt: string;
}
