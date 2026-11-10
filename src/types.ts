export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 
  | 'moefcc_officer'
  | 'state_campa_officer'
  | 'proponent_esg'
  | 'independent_auditor'
  | 'citizen_researcher';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organization: string;
  department?: string;
  badgeNumber?: string;
  jurisdiction: string;
  clearanceLevel: 'Statutory Authority' | 'State Nodal' | 'Proponent ESG' | 'Accredited Auditor' | 'Public Inspector';
  avatarUrl?: string;
  joinedDate: string;
}

export type ProjectStatus = 
  | 'likely_recovery'
  | 'monitoring_required'
  | 'evidence_discrepancy'
  | 'field_verification_priority'
  | 'insufficient_evidence';

export interface TimelineMilestone {
  id: string;
  date: string;
  milestoneLabel: string;
  imageThumbnail: string;
  satelliteLayer: 'true_color' | 'false_color' | 'ndvi';
  sensor: string;
  cloudCover: string;
  observation: string;
  status: ProjectStatus;
  ndviValue: number;
  ndviDelta: string;
  canopyDensity: string;
  fieldEvidence?: {
    available: boolean;
    inspector?: string;
    notes?: string;
    dateRecorded?: string;
  };
  metadata: {
    resolution: string;
    solarZenith: string;
    bandsUsed: string;
    acquisitionDate: string;
    sceneId: string;
  };
}

export interface Project {
  id: string;
  name: string;
  proponent: string;
  state: string;
  district: string;
  sector: string;
  status: ProjectStatus;
  complianceRiskScore: number; // 0 to 100
  riskLevel: 'Low' | 'Medium' | 'High';
  evidenceConfidenceScore: number; // 0 to 100
  confidenceLevel: 'High' | 'Medium' | 'Low';
  forestRecoveryScore: number; // 0 to 100 (from PPT)
  complianceScore: number; // 0 to 100 (from PPT)
  lastMonitoringDate: string; // e.g. "05 Sep 2026 (Sentinel-2 Revisit)"
  alertStatus: {
    level: 'critical' | 'warning' | 'nominal';
    label: string;
    confidencePercent: number;
    summary: string;
  };
  aiCompliance: {
    modelType: string; // e.g. "Random Forest + LSTM Time-Series Anomaly Detector"
    confidenceScore: number;
    nonComplianceFlagged: boolean;
    anomalySeverity: string;
    flags: string[];
  };
  vegetationAnalytics: {
    currentNdvi: number;
    currentEvi: number;
    baselineNdvi: number;
    baselineEvi: number;
    targetNdvi: number;
    targetEvi: number;
    growthTrend: string;
    revisitFrequency: string;
  };
  clearanceFileRef: string;
  clearanceDate: string;
  promise: {
    shortClaim: string;
    deadline: string;
    requiredArea: string;
    sourcePdfPage: string;
    specificCondition: string;
    saplingCount: string;
    targetNdvi: number;
    clauseExcerpt: string;
  };
  proof: {
    latestObservation: string;
    recoveryTrend: string;
    evidenceQuality: string;
    plainLanguageExplanation: string;
    recommendedAction: string;
    currentNdvi: number;
    baselineNdvi: number;
    targetNdvi: number;
  };
  timeline: TimelineMilestone[];
  mapData: {
    center: [number, number]; // [lat, lng]
    zoom: number;
    impactAreaName: string;
    impactAreaHa: number;
    caPlotName: string;
    caPlotHa: number;
    clearanceForestDivision?: string;
    caParcelStatus?: string;
    boundaryCoords: { x: number; y: number }[]; // normalized svg polygon coordinates
    impactCoords: { x: number; y: number }[];
    waterCoords?: { x: number; y: number }[];
    riskHatchCoords?: { x: number; y: number }[];
    coordinatesDisplay: string;
    surveyNumbers: string;
  };
  chartData: {
    date: string;
    dateLabel: string;
    actualNdvi: number;
    expectedNdvi: number;
    baselineNdvi: number;
    actualEvi?: number;
    expectedEvi?: number;
    baselineEvi?: number;
    phase: 'Baseline' | 'Planting' | 'Monitoring';
    milestoneAnnotation?: string;
  }[];
  technicalEvidence: {
    canopyCoverPercent: number;
    sarBackscatterDb: string;
    moistureIndex: number;
    cloudFreeObservations: number;
    sentinelSceneId: string;
    latLongBBox: string;
    sensorConstellation: string;
  };
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SatelliteScene {
  id: string;
  sensor: string;
  constellation: string;
  acquisitionDate: string;
  displayDate: string;
  cloudCover: number;
  sunElevation: number;
  sunAzimuth: number;
  resolution: string;
  crs: string;
  tileId: string;
  bbox: [number, number, number, number];
  centroid: [number, number];
  thumbnailUrl: string;
  visualUrl?: string;
  bandsAvailable: string[];
  provenance: string;
  processingLevel: string;
}

export type PipelineStageStatus = 'not_started' | 'ready' | 'processing' | 'completed' | 'failed';

export interface PipelineExecutionResult {
  jobId: string;
  sceneId: string;
  telemetry: {
    baselineNdvi: number;
    targetNdvi: number;
    observedNdvi: number;
    observedEvi: number;
    crownCoverObserved: string;
    crownCoverMandated: string;
    complianceScore: number;
    complianceRiskScore: number;
    statutoryVerdict: 'NON_COMPLIANT_DEFICIT' | 'PARTIAL_COMPLIANCE' | 'FULL_COMPLIANCE';
    recommendedAction: string;
  };
  executionLogs: string[];
}

