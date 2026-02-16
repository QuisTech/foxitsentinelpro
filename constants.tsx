
import React from 'react';
import { Template, PdfService } from './types';

export const TEMPLATES: Template[] = [
  {
    id: 'TPL-NDA-V2',
    name: 'Non-Disclosure Agreement',
    icon: '📄',
    schema: {
      partyA: 'Acme Global Inc.',
      partyB: 'Strategic Partners LLC',
      governingLaw: 'California',
      termYears: '3'
    }
  },
  {
    id: 'TPL-SVC-V1',
    name: 'Master Service Agreement',
    icon: '💼',
    schema: {
      clientName: 'Future Corp',
      projectScope: 'API Integration Phase 1',
      billingRate: '$250/hr',
      effectiveDate: '2026-05-12'
    }
  },
  {
    id: 'TPL-EMP-V4',
    name: 'Employment Offer',
    icon: '👔',
    schema: {
      candidateName: 'Jane Doe',
      position: 'Senior Engineer',
      salary: '$180,000',
      equity: '0.05%'
    }
  }
];

export const PDF_SERVICES: PdfService[] = [
  { 
    id: 'watermark', 
    name: 'Dynamic Watermark', 
    icon: '💧', 
    description: 'Inject "OFFICIAL COPY" overlays' 
  },
  { 
    id: 'linearize', 
    name: 'Web Optimization', 
    icon: '⚡', 
    description: 'Fast linearization for court portals' 
  },
  { 
    id: 'protect', 
    name: 'AES-256 Encryption', 
    icon: '🔒', 
    description: 'Password-protect sensitive artifacts' 
  },
  { 
    id: 'redact', 
    name: 'Smart Redaction', 
    icon: '✂️', 
    description: 'Auto-mask PII data points' 
  }
];

export const JUDGE_QUICK_TIPS = [
  "Check the Traceability Ledger for event sourcing details.",
  "Toggle Judge Mode to see technical API metadata.",
  "Observe the multi-step pipeline orchestration in real-time.",
  "Generated PDF previews are simulated for high-fidelity UI demonstration."
];

export const POLICY_ID = "SENTINEL-REST-V4.2.1";
