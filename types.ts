
export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING', // DocGen
  PROCESSING = 'PROCESSING', // PDF Cloud Services
  SIGNING = 'SIGNING',       // eSign
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  step: string;
  action: string;
  status: 'success' | 'info' | 'error';
  metadata?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  icon: string;
  schema: Record<string, string>;
}

export interface PdfService {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface FoxitProject {
  id: string;
  name: string;
  templateId: string;
  data: Record<string, string>;
  status: AppStatus;
  appliedServices: string[];
  signeeEmail: string;
  traceId: string;
  events: AuditEvent[];
  outputUrl?: string;
}

export interface ProcessingStatus {
  step: AppStatus;
  message: string;
  events: AuditEvent[];
  traceId?: string;
}
