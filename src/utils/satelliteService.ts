import { SatelliteScene, PipelineExecutionResult } from '../types';

export interface SatelliteSearchParams {
  coordinates?: [number, number];
  bbox?: [number, number, number, number];
  dateRange?: { start: string; end: string };
  satellite?: 'sentinel-2-l2a' | 'landsat-c2-l2' | 'sentinel-1-grd';
  maxCloudCover?: number;
  limit?: number;
}

export interface SatelliteProviderStatus {
  stacProvider: {
    name: string;
    status: 'operational' | 'degraded' | 'offline';
    latencyMs: number;
    endpoint: string;
    openAccess: boolean;
    requiresAuth: boolean;
  };
  supportedSensors: Array<{
    id: string;
    name: string;
    resolution: string;
    revisitDays: number;
    bands?: number;
    polarizations?: string[];
  }>;
  credentialsConfigured: {
    copernicusCdse: boolean;
    sentinelHub: boolean;
    note: string;
  };
}

export const SATELLITE_PRESETS: Array<{
  id: string;
  name: string;
  state: string;
  district: string;
  coordinates: [number, number];
  description: string;
  mandatedAreaHa: number;
  targetNdvi: number;
  baselineNdvi: number;
}> = [
  {
    id: 'solapur-green-corridor',
    name: 'Solapur Green Corridor (Phase-II)',
    state: 'Maharashtra',
    district: 'Solapur',
    coordinates: [17.6599, 75.9064],
    description: 'NH-52 bypass diversion; canal side afforestation covenant with dry-deciduous species.',
    mandatedAreaHa: 145,
    targetNdvi: 0.65,
    baselineNdvi: 0.21,
  },
  {
    id: 'hasdeo-arand-buffer',
    name: 'Hasdeo Arand Sal Reserve',
    state: 'Chhattisgarh',
    district: 'Korba',
    coordinates: [22.8123, 82.6841],
    description: 'Dense Sal canopy buffer zone adjacent to coal block clearance boundaries.',
    mandatedAreaHa: 280,
    targetNdvi: 0.78,
    baselineNdvi: 0.42,
  },
  {
    id: 'singrauli-coalfields',
    name: 'Northern Coalfields Green Belt',
    state: 'Madhya Pradesh',
    district: 'Singrauli',
    coordinates: [24.1997, 82.6681],
    description: 'Overburden dump stabilization and compensatory buffer plantation.',
    mandatedAreaHa: 310,
    targetNdvi: 0.60,
    baselineNdvi: 0.18,
  },
  {
    id: 'bellary-sandur-ridge',
    name: 'Sandur Iron Ore Ridge',
    state: 'Karnataka',
    district: 'Ballari',
    coordinates: [15.1394, 76.9214],
    description: 'Re-vegetation of mined ridges under Supreme Court CEC oversight.',
    mandatedAreaHa: 195,
    targetNdvi: 0.58,
    baselineNdvi: 0.19,
  },
  {
    id: 'kutch-mangrove-strip',
    name: 'Mundra Coastal Mangrove Strip',
    state: 'Gujarat',
    district: 'Kutch',
    coordinates: [23.2420, 69.6669],
    description: 'Intertidal mangrove compensation for port & SEZ expansion.',
    mandatedAreaHa: 120,
    targetNdvi: 0.52,
    baselineNdvi: 0.14,
  },
  {
    id: 'raigarh-coal-belt',
    name: 'Gharghoda Compensatory Plantation',
    state: 'Chhattisgarh',
    district: 'Raigarh',
    coordinates: [21.8974, 83.3950],
    description: 'Mixed teak and bamboo afforestation plot mandated for rail siding.',
    mandatedAreaHa: 160,
    targetNdvi: 0.68,
    baselineNdvi: 0.25,
  },
];

export async function fetchSatelliteStatus(): Promise<SatelliteProviderStatus> {
  try {
    const res = await fetch('/api/satellite/status');
    if (!res.ok) {
      throw new Error(`Satellite status check failed: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn('Satellite status network error:', err);
    return {
      stacProvider: {
        name: 'AWS Earth Search (Element 84) STAC Catalog',
        status: 'degraded',
        latencyMs: 999,
        endpoint: 'https://earth-search.aws.element84.com/v1',
        openAccess: true,
        requiresAuth: false,
      },
      supportedSensors: [
        { id: 'sentinel-2-l2a', name: 'Copernicus Sentinel-2 MSI (Level-2A BOA)', resolution: '10m', revisitDays: 5, bands: 13 },
        { id: 'landsat-c2-l2', name: 'USGS/NASA Landsat 8/9 OLI/TIRS', resolution: '30m', revisitDays: 8, bands: 11 },
        { id: 'sentinel-1-grd', name: 'Copernicus Sentinel-1 C-Band SAR (Radar)', resolution: '10m', revisitDays: 6, polarizations: ['VV', 'VH'] },
      ],
      credentialsConfigured: {
        copernicusCdse: false,
        sentinelHub: false,
        note: 'Fallback mode active: calibrated ESA Copernicus reference datasets available.',
      },
    };
  }
}

export async function geocodeLocation(query: string): Promise<{
  found: boolean;
  name?: string;
  lat?: number;
  lon?: number;
  bbox?: [number, number, number, number];
  message?: string;
  suggestedRegions?: Array<{ name: string; lat: number; lon: number }>;
}> {
  try {
    const res = await fetch('/api/satellite/geocode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      throw new Error(`Geocode request failed: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      found: false,
      message: err.message || 'Geocoding failed to reach server.',
    };
  }
}

export async function querySatelliteScenes(params: SatelliteSearchParams): Promise<{
  success: boolean;
  provider: string;
  matchedCount: number;
  scenes: SatelliteScene[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/satellite/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Failed to fetch satellite imagery: HTTP ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.error('querySatelliteScenes error:', err);
    throw new Error(
      err.message || 'Unable to retrieve satellite imagery. Please check the selected date range, coordinates, or satellite service configuration.'
    );
  }
}

export async function executePipelineAnalysis(params: {
  sceneId: string;
  coordinates: [number, number];
  plotAreaHa?: number;
  targetNdvi?: number;
  baselineNdvi?: number;
  targetTreeSpecies?: string;
}): Promise<PipelineExecutionResult> {
  try {
    const res = await fetch('/api/satellite/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Pipeline execution failed: HTTP ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.error('executePipelineAnalysis error:', err);
    throw new Error(
      err.message || 'Failed to complete satellite spectral analysis. Please verify scene calibration and retry.'
    );
  }
}
