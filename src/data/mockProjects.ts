import { Project } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'solapur-green-corridor',
    name: 'Solapur Green Corridor Phase-II',
    proponent: 'Maharashtra State Road Development Corporation (MSRDC)',
    state: 'Maharashtra',
    district: 'Solapur',
    sector: 'Highway & Infrastructure',
    status: 'field_verification_priority',
    complianceRiskScore: 84,
    riskLevel: 'High',
    evidenceConfidenceScore: 78,
    confidenceLevel: 'Medium',
    forestRecoveryScore: 32,
    complianceScore: 28,
    lastMonitoringDate: '02 Mar 2026 (~5-day Sentinel-2 Pass)',
    alertStatus: {
      level: 'critical',
      label: 'Critical Recovery Deficit',
      confidencePercent: 94,
      summary: 'Severe vegetative deficit (-0.31 NDVI below mandated threshold) across 100 ha designated parcel after deadline.',
    },
    aiCompliance: {
      modelType: 'Random Forest + LSTM Time-Series Anomaly Detector',
      confidenceScore: 94,
      nonComplianceFlagged: true,
      anomalySeverity: 'Critical Deficit',
      flags: [
        'Persistent multi-year NDVI stagnation (+0.04 vs expected +0.35)',
        'Observed canopy density 15.2% vs legally mandated 40%',
        'No water retention or soil conservation signatures detected on-site'
      ],
    },
    vegetationAnalytics: {
      currentNdvi: 0.31,
      currentEvi: 0.18,
      baselineNdvi: 0.27,
      baselineEvi: 0.14,
      targetNdvi: 0.62,
      targetEvi: 0.44,
      growthTrend: 'Flatline trajectory (+0.04 NDVI delta over 36 months)',
      revisitFrequency: 'Every ~5 days (Sentinel-2A/2B MSI)',
    },
    clearanceFileRef: 'MoEFCC-FC-MH-2021-8842.pdf',
    clearanceDate: '18 October 2021',
    promise: {
      shortClaim: '100 hectares of compensatory afforestation by March 2026.',
      deadline: 'March 2026',
      requiredArea: '100 ha (125,000 native saplings)',
      sourcePdfPage: 'Clearance PDF, Page 14, Condition 7',
      specificCondition: 'Condition 7(a): The user agency shall carry out compensatory afforestation over 100 ha of non-forest revenue land in Gut No. 42 & 43, Village Barshi, with local indigenous species including Neem, Tamarind, and Babool, maintaining at least 1,200 plants per hectare.',
      saplingCount: '125,000 indigenous trees',
      targetNdvi: 0.62,
      clauseExcerpt: 'Condition 7: The user agency shall deposit CA funds in CAMPA Maharashtra and complete plantation over 100 hectares before March 2026, achieving a minimum canopy density of 40%.'
    },
    proof: {
      latestObservation: 'Vegetation recovery remains weak in the mapped boundary after the deadline.',
      recoveryTrend: 'Flatline trajectory (+0.04 NDVI delta over 36 months)',
      evidenceQuality: 'Medium confidence (14 cloud-free Sentinel-2 optical passes + Sentinel-1 SAR dry-season radar)',
      plainLanguageExplanation: 'Satellite imagery over the 100 ha designated polygon shows sparse scrub and bare soil. The vegetation growth is substantially below the required 40% canopy density threshold.',
      recommendedAction: 'Request geo-tagged field evidence and schedule inspection with divisional forest officer.',
      currentNdvi: 0.31,
      baselineNdvi: 0.27,
      targetNdvi: 0.62
    },
    mapData: {
      center: [17.6599, 75.9064],
      zoom: 14,
      impactAreaName: 'NH-52 Highway Widening Corridor (46.2 ha diverted)',
      impactAreaHa: 46.2,
      caPlotName: 'Compensatory Afforestation Plot, Barshi Gut 42/43',
      caPlotHa: 100.0,
      clearanceForestDivision: 'Solapur Territorial Forest Division',
      caParcelStatus: 'Flagged for High-Priority Field Audit',
      coordinatesDisplay: '17°39\'35.6"N 75°54\'23.0"E',
      surveyNumbers: 'Gut No. 42, 43, Barshi Taluka, Solapur',
      boundaryCoords: [
        { x: 38, y: 22 },
        { x: 68, y: 20 },
        { x: 74, y: 48 },
        { x: 55, y: 64 },
        { x: 32, y: 55 }
      ],
      impactCoords: [
        { x: 12, y: 72 },
        { x: 26, y: 68 },
        { x: 42, y: 80 },
        { x: 22, y: 88 }
      ],
      waterCoords: [
        { x: 78, y: 28 },
        { x: 88, y: 35 },
        { x: 82, y: 44 }
      ],
      riskHatchCoords: [
        { x: 40, y: 26 },
        { x: 62, y: 24 },
        { x: 66, y: 46 },
        { x: 36, y: 50 }
      ]
    },
    chartData: [
      { date: '2021-11', dateLabel: 'Nov 2021', actualNdvi: 0.27, expectedNdvi: 0.27, baselineNdvi: 0.27, actualEvi: 0.14, expectedEvi: 0.14, baselineEvi: 0.14, phase: 'Baseline', milestoneAnnotation: 'Clearance Baseline' },
      { date: '2022-07', dateLabel: 'Jul 2022', actualNdvi: 0.29, expectedNdvi: 0.34, baselineNdvi: 0.27, actualEvi: 0.16, expectedEvi: 0.22, baselineEvi: 0.14, phase: 'Planting' },
      { date: '2022-11', dateLabel: 'Nov 2022', actualNdvi: 0.32, expectedNdvi: 0.40, baselineNdvi: 0.27, actualEvi: 0.18, expectedEvi: 0.26, baselineEvi: 0.14, phase: 'Planting' },
      { date: '2023-04', dateLabel: 'Apr 2023', actualNdvi: 0.26, expectedNdvi: 0.38, baselineNdvi: 0.27, actualEvi: 0.15, expectedEvi: 0.25, baselineEvi: 0.14, phase: 'Planting' },
      { date: '2023-10', dateLabel: 'Oct 2023', actualNdvi: 0.33, expectedNdvi: 0.48, baselineNdvi: 0.27, actualEvi: 0.19, expectedEvi: 0.32, baselineEvi: 0.14, phase: 'Monitoring', milestoneAnnotation: 'First post-monsoon review' },
      { date: '2024-03', dateLabel: 'Mar 2024', actualNdvi: 0.28, expectedNdvi: 0.46, baselineNdvi: 0.27, actualEvi: 0.16, expectedEvi: 0.31, baselineEvi: 0.14, phase: 'Monitoring' },
      { date: '2024-10', dateLabel: 'Oct 2024', actualNdvi: 0.34, expectedNdvi: 0.54, baselineNdvi: 0.27, actualEvi: 0.20, expectedEvi: 0.37, baselineEvi: 0.14, phase: 'Monitoring', milestoneAnnotation: '12-month comparison' },
      { date: '2025-03', dateLabel: 'Mar 2025', actualNdvi: 0.29, expectedNdvi: 0.52, baselineNdvi: 0.27, actualEvi: 0.17, expectedEvi: 0.35, baselineEvi: 0.14, phase: 'Monitoring' },
      { date: '2025-10', dateLabel: 'Oct 2025', actualNdvi: 0.33, expectedNdvi: 0.59, baselineNdvi: 0.27, actualEvi: 0.19, expectedEvi: 0.41, baselineEvi: 0.14, phase: 'Monitoring' },
      { date: '2026-03', dateLabel: 'Mar 2026', actualNdvi: 0.31, expectedNdvi: 0.62, baselineNdvi: 0.27, actualEvi: 0.18, expectedEvi: 0.44, baselineEvi: 0.14, phase: 'Monitoring', milestoneAnnotation: 'Planting deadline' }
    ],
    timeline: [
      {
        id: 'solapur-t1',
        date: '12 Nov 2021',
        milestoneLabel: 'Pre-clearing Baseline',
        imageThumbnail: 'satellite_base_solapur_2021',
        satelliteLayer: 'true_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.4% cloud cover',
        observation: 'Baseline dry open scrubland with sparse acacia; baseline NDVI measured at 0.27.',
        status: 'likely_recovery',
        ndviValue: 0.27,
        ndviDelta: 'Baseline (0.00)',
        canopyDensity: '12%',
        fieldEvidence: {
          available: true,
          inspector: 'DFO Solapur Territorial Division',
          notes: 'Pre-diversion joint inspection verified Gut 42 & 43 vacant revenue wasteland, clear of encroachment.',
          dateRecorded: '15 Nov 2021'
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '32.1°',
          bandsUsed: 'B04 (Red), B03 (Green), B02 (Blue)',
          acquisitionDate: '2021-11-12T05:22:18Z',
          sceneId: 'S2A_MSIL2A_20211112T052218_N0301_R076_T43QDA'
        }
      },
      {
        id: 'solapur-t2',
        date: '28 Jul 2022',
        milestoneLabel: 'Mandated Planting Window',
        imageThumbnail: 'satellite_planting_solapur_2022',
        satelliteLayer: 'false_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '1.8% cloud cover',
        observation: 'Fresh pit preparation detected along southern 20 ha; no contiguous ground cover apparent.',
        status: 'monitoring_required',
        ndviValue: 0.29,
        ndviDelta: '+0.02 from baseline',
        canopyDensity: '14%',
        fieldEvidence: {
          available: false
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '24.6°',
          bandsUsed: 'B08 (NIR), B04 (Red), B03 (Green)',
          acquisitionDate: '2022-07-28T05:25:01Z',
          sceneId: 'S2B_MSIL2A_20220728T052501_N0400_R076_T43QDA'
        }
      },
      {
        id: 'solapur-t3',
        date: '18 Oct 2023',
        milestoneLabel: 'First Post-Monsoon Review',
        imageThumbnail: 'satellite_monsoon_solapur_2023',
        satelliteLayer: 'ndvi',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.9% cloud cover',
        observation: 'Transient annual grass flush elevated NDVI to 0.33; no deep-rooted woody biomass signature.',
        status: 'monitoring_required',
        ndviValue: 0.33,
        ndviDelta: '+0.06 (seasonal surge)',
        canopyDensity: '16%',
        fieldEvidence: {
          available: true,
          inspector: 'Range Forest Officer, Barshi',
          notes: 'Survival rate recorded at 52% due to insufficient post-planting drip irrigation during dry winter spells.',
          dateRecorded: '22 Oct 2023'
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '34.8°',
          bandsUsed: 'NDVI (B08-B04)/(B08+B04)',
          acquisitionDate: '2023-10-18T05:21:49Z',
          sceneId: 'S2A_MSIL2A_20231018T052149_N0509_R076_T43QDA'
        }
      },
      {
        id: 'solapur-t4',
        date: '24 Oct 2024',
        milestoneLabel: '12-Month Comparison',
        imageThumbnail: 'satellite_annual_solapur_2024',
        satelliteLayer: 'ndvi',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.3% cloud cover',
        observation: 'Stagnant vegetation signature across 78% of plot; canopy expansion not tracking expected trajectory.',
        status: 'evidence_discrepancy',
        ndviValue: 0.34,
        ndviDelta: '+0.07 vs expected +0.27',
        canopyDensity: '17%',
        fieldEvidence: {
          available: false
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '33.9°',
          bandsUsed: 'NDVI (B08-B04)/(B08+B04)',
          acquisitionDate: '2024-10-24T05:22:11Z',
          sceneId: 'S2B_MSIL2A_20241024T052211_N0511_R076_T43QDA'
        }
      },
      {
        id: 'solapur-t5',
        date: '02 Mar 2026',
        milestoneLabel: 'Planting Deadline Observation',
        imageThumbnail: 'satellite_latest_solapur_2026',
        satelliteLayer: 'false_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.2% cloud cover',
        observation: 'Recovery remains weak at 0.31 NDVI against required 0.62 threshold; bare soil dominates north & central sectors.',
        status: 'field_verification_priority',
        ndviValue: 0.31,
        ndviDelta: '+0.04 from baseline (deficit -0.31)',
        canopyDensity: '15%',
        fieldEvidence: {
          available: true,
          inspector: 'Independent Monitoring Cell Alert',
          notes: 'High spatial discrepancy flagged. No secondary water storage ponds or protective barbed fencing identified on site.',
          dateRecorded: '04 Mar 2026'
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '28.4°',
          bandsUsed: 'B08 (NIR), B04 (Red), B03 (Green)',
          acquisitionDate: '2026-03-02T05:20:33Z',
          sceneId: 'S2A_MSIL2A_20260302T052033_N0514_R076_T43QDA'
        }
      }
    ],
    technicalEvidence: {
      canopyCoverPercent: 15.2,
      sarBackscatterDb: '-14.8 dB (VH/VV dry soil response)',
      moistureIndex: 0.12,
      cloudFreeObservations: 38,
      sentinelSceneId: 'S2A_MSIL2A_20260302T052033_N0514_R076_T43QDA',
      latLongBBox: '17.6511°N, 75.8992°E to 17.6698°N, 75.9145°E',
      sensorConstellation: 'Copernicus Sentinel-2A/2B MSI & Sentinel-1 C-SAR'
    }
  },
  {
    id: 'sundargarh-coal-washery',
    name: 'Sundargarh Coal Washery Buffer Zone',
    proponent: 'Mahanadi Coalfields Limited (MCL)',
    state: 'Odisha',
    district: 'Sundargarh',
    sector: 'Mining',
    status: 'evidence_discrepancy',
    complianceRiskScore: 71,
    riskLevel: 'High',
    evidenceConfidenceScore: 88,
    confidenceLevel: 'High',
    forestRecoveryScore: 19,
    complianceScore: 15,
    lastMonitoringDate: '20 Nov 2024 (Sentinel-2 Pass)',
    alertStatus: {
      level: 'critical',
      label: 'Spatial Boundary Discrepancy',
      confidencePercent: 96,
      summary: 'Designated 145 ha KML polygon overlaps active overburden dump; planting detected 3.2 km off-site.',
    },
    aiCompliance: {
      modelType: 'Random Forest + LSTM Time-Series Anomaly Detector',
      confidenceScore: 96,
      nonComplianceFlagged: true,
      anomalySeverity: 'Severe Encroachment',
      flags: [
        'Active industrial spoil dumping inside statutory afforestation polygon',
        'Spatial misalignment between Parivesh clearance KML and ground site',
        'NDVI deficit -0.46 below statutory 0.68 target'
      ],
    },
    vegetationAnalytics: {
      currentNdvi: 0.22,
      currentEvi: 0.11,
      baselineNdvi: 0.21,
      baselineEvi: 0.10,
      targetNdvi: 0.68,
      targetEvi: 0.48,
      growthTrend: 'Severe negative/flatline anomaly (-0.46 deficit)',
      revisitFrequency: 'Every ~5 days (Sentinel-2 MSI)',
    },
    clearanceFileRef: 'MoEFCC-EC-OR-2020-4109.pdf',
    clearanceDate: '14 January 2020',
    promise: {
      shortClaim: '145 hectares of high-density native deciduous plantation by November 2024.',
      deadline: 'November 2024',
      requiredArea: '145 ha (180,000 mixed Sal & Mahua trees)',
      sourcePdfPage: 'Clearance PDF, Page 9, Condition 12',
      specificCondition: 'Condition 12: Proponent shall develop a three-tier green belt of 145 ha along the northern sub-basin boundary to attenuate fugitive dust, with minimum 75% survival rate by Year 4.',
      saplingCount: '180,000 broadleaf saplings',
      targetNdvi: 0.68,
      clauseExcerpt: 'Condition 12: Permanent green buffer over 145 hectares to be established with indigenous species prior to Stage-II operational expansion.'
    },
    proof: {
      latestObservation: 'Designated compensatory polygon overlaps active overburden dump; planting detected 3.2 km off-site.',
      recoveryTrend: 'Location mismatch detected (designated coordinates show active earth moving)',
      evidenceQuality: 'High confidence (Sentinel-2 multi-spectral + PlanetScope 3m resolution cross-reference)',
      plainLanguageExplanation: 'While greening is visible on adjacent village common land, the legally mandated 145 ha KML polygon contains industrial earth movement and minimal vegetative canopy.',
      recommendedAction: 'Re-survey boundary pillars and issue formal discrepancy memo to regional forest office.',
      currentNdvi: 0.22,
      baselineNdvi: 0.21,
      targetNdvi: 0.68
    },
    mapData: {
      center: [22.1245, 84.0321],
      zoom: 14,
      impactAreaName: 'Sundargarh Washery Excavation Zone (112 ha)',
      impactAreaHa: 112.0,
      caPlotName: 'Mandated Northern Green Buffer (145 ha)',
      caPlotHa: 145.0,
      coordinatesDisplay: '22°07\'28.2"N 84°01\'55.6"E',
      surveyNumbers: 'Plot 301 to 318, Hemgir Forest Division, Sundargarh',
      boundaryCoords: [
        { x: 30, y: 15 },
        { x: 72, y: 18 },
        { x: 80, y: 50 },
        { x: 45, y: 56 },
        { x: 25, y: 40 }
      ],
      impactCoords: [
        { x: 35, y: 58 },
        { x: 65, y: 55 },
        { x: 70, y: 85 },
        { x: 30, y: 88 }
      ],
      waterCoords: [
        { x: 15, y: 25 },
        { x: 22, y: 35 }
      ],
      riskHatchCoords: [
        { x: 35, y: 22 },
        { x: 68, y: 24 },
        { x: 75, y: 45 },
        { x: 32, y: 38 }
      ]
    },
    chartData: [
      { date: '2020-03', dateLabel: 'Mar 2020', actualNdvi: 0.21, expectedNdvi: 0.21, baselineNdvi: 0.21, phase: 'Baseline', milestoneAnnotation: 'Clearance approval' },
      { date: '2021-02', dateLabel: 'Feb 2021', actualNdvi: 0.23, expectedNdvi: 0.32, baselineNdvi: 0.21, phase: 'Planting' },
      { date: '2022-01', dateLabel: 'Jan 2022', actualNdvi: 0.22, expectedNdvi: 0.44, baselineNdvi: 0.21, phase: 'Planting' },
      { date: '2022-11', dateLabel: 'Nov 2022', actualNdvi: 0.24, expectedNdvi: 0.52, baselineNdvi: 0.21, phase: 'Monitoring', milestoneAnnotation: 'First post-monsoon review' },
      { date: '2023-11', dateLabel: 'Nov 2023', actualNdvi: 0.21, expectedNdvi: 0.60, baselineNdvi: 0.21, phase: 'Monitoring' },
      { date: '2024-11', dateLabel: 'Nov 2024', actualNdvi: 0.22, expectedNdvi: 0.68, baselineNdvi: 0.21, phase: 'Monitoring', milestoneAnnotation: 'Planting deadline' },
      { date: '2025-11', dateLabel: 'Nov 2025', actualNdvi: 0.23, expectedNdvi: 0.70, baselineNdvi: 0.21, phase: 'Monitoring' }
    ],
    timeline: [
      {
        id: 'sundargarh-t1',
        date: '10 Mar 2020',
        milestoneLabel: 'Baseline Approval State',
        imageThumbnail: 'satellite_base_sundargarh_2020',
        satelliteLayer: 'true_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.1% cloud cover',
        observation: 'Dense Sal forest boundary before industrial diversion; baseline index 0.21 on buffer zone.',
        status: 'monitoring_required',
        ndviValue: 0.21,
        ndviDelta: 'Baseline (0.00)',
        canopyDensity: '9%',
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '35.2°',
          bandsUsed: 'B04, B03, B02',
          acquisitionDate: '2020-03-10T04:58:21Z',
          sceneId: 'S2A_MSIL2A_20200310T045821_N0214_R033_T45QTF'
        }
      },
      {
        id: 'sundargarh-t2',
        date: '15 Nov 2022',
        milestoneLabel: 'Mid-Term Planting Phase',
        imageThumbnail: 'satellite_mid_sundargarh_2022',
        satelliteLayer: 'false_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.6% cloud cover',
        observation: 'High mineral reflectance detected inside northern polygon; earth-moving machinery visible.',
        status: 'evidence_discrepancy',
        ndviValue: 0.24,
        ndviDelta: '+0.03 vs required +0.31',
        canopyDensity: '11%',
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '38.0°',
          bandsUsed: 'B08, B04, B03',
          acquisitionDate: '2022-11-15T04:59:12Z',
          sceneId: 'S2B_MSIL2A_20221115T045912_N0400_R033_T45QTF'
        }
      },
      {
        id: 'sundargarh-t3',
        date: '20 Nov 2024',
        milestoneLabel: 'Compliance Deadline Pass',
        imageThumbnail: 'satellite_latest_sundargarh_2024',
        satelliteLayer: 'ndvi',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.2% cloud cover',
        observation: 'Target polygon remains non-vegetated; spatial coordinates mismatch between submitted KML and ground site.',
        status: 'evidence_discrepancy',
        ndviValue: 0.22,
        ndviDelta: '+0.01 from baseline (deficit -0.46)',
        canopyDensity: '8%',
        fieldEvidence: {
          available: true,
          inspector: 'RFO Hemgir Range',
          notes: 'Boundary coordinates in Form-A do not align with physical boundary pillars 14 to 28.',
          dateRecorded: '25 Nov 2024'
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '39.4°',
          bandsUsed: 'NDVI (B08-B04)/(B08+B04)',
          acquisitionDate: '2024-11-20T04:57:44Z',
          sceneId: 'S2A_MSIL2A_20241120T045744_N0511_R033_T45QTF'
        }
      }
    ],
    technicalEvidence: {
      canopyCoverPercent: 8.4,
      sarBackscatterDb: '-9.4 dB (coarse mineral spoil pile signature)',
      moistureIndex: 0.08,
      cloudFreeObservations: 42,
      sentinelSceneId: 'S2A_MSIL2A_20241120T045744_N0511_R033_T45QTF',
      latLongBBox: '22.1180°N, 84.0210°E to 22.1320°N, 84.0450°E',
      sensorConstellation: 'Copernicus Sentinel-2 & Sentinel-1 SAR'
    }
  },
  {
    id: 'betul-transmission-line',
    name: 'Betul Transmission Line Afforestation',
    proponent: 'Power Grid Corporation of India Ltd (PGCIL)',
    state: 'Madhya Pradesh',
    district: 'Betul',
    sector: 'Power & Energy',
    status: 'likely_recovery',
    complianceRiskScore: 18,
    riskLevel: 'Low',
    evidenceConfidenceScore: 92,
    confidenceLevel: 'High',
    forestRecoveryScore: 91,
    complianceScore: 96,
    lastMonitoringDate: '18 Jul 2025 (Sentinel-2 Pass)',
    alertStatus: {
      level: 'nominal',
      label: 'Optimal Canopy Growth',
      confidencePercent: 92,
      summary: 'Established multi-tier canopy closure exceeding mandated target across 85 ha demarcated plot.',
    },
    aiCompliance: {
      modelType: 'Random Forest + LSTM Time-Series Anomaly Detector',
      confidenceScore: 92,
      nonComplianceFlagged: false,
      anomalySeverity: 'Nominal Recovery',
      flags: [
        'Positive time-series acceleration matching expected forest succession',
        'Canopy cover verified at 58.6% vs statutory 40% threshold',
        'Contour trench soil-moisture retention structures clearly resolved in SAR'
      ],
    },
    vegetationAnalytics: {
      currentNdvi: 0.61,
      currentEvi: 0.42,
      baselineNdvi: 0.28,
      baselineEvi: 0.16,
      targetNdvi: 0.58,
      targetEvi: 0.39,
      growthTrend: 'Consistent positive trajectory (+0.33 NDVI delta over 5 years)',
      revisitFrequency: 'Every ~5 days (Sentinel-2 MSI)',
    },
    clearanceFileRef: 'MoEFCC-FC-MP-2019-3281.pdf',
    clearanceDate: '09 August 2019',
    promise: {
      shortClaim: '85 hectares of multi-tier native teak and bamboo compensatory afforestation by July 2025.',
      deadline: 'July 2025',
      requiredArea: '85 ha (102,000 mixed saplings)',
      sourcePdfPage: 'Clearance PDF, Page 6, Condition 5',
      specificCondition: 'Condition 5: The user agency shall afforest 85 ha of degraded forest land in Compartment P-214 of South Betul Forest Division, with soil-moisture conservation structures and native species.',
      saplingCount: '102,000 teak, bamboo, and amla trees',
      targetNdvi: 0.58,
      clauseExcerpt: 'Condition 5: Compensatory afforestation over 85 ha of degraded forest land to be completed by July 2025 with at least 80% survival.'
    },
    proof: {
      latestObservation: 'Robust multi-temporal canopy closure confirmed; post-monsoon NDVI has climbed from 0.28 to 0.61 across 92% of the demarcated plot.',
      recoveryTrend: 'Consistent positive trajectory (+0.33 NDVI delta over 5 years)',
      evidenceQuality: 'High confidence (Sentinel-2 + Sentinel-1 cross-polarization radar confirms structural woody volume)',
      plainLanguageExplanation: 'Satellite imagery shows uniform tree canopy closure matching mandated multi-tier afforestation guidelines. Continuous moisture retention structures are visible.',
      recommendedAction: 'Maintain regular satellite tracking; no emergency field inspection required.',
      currentNdvi: 0.61,
      baselineNdvi: 0.28,
      targetNdvi: 0.58
    },
    mapData: {
      center: [21.9012, 77.9023],
      zoom: 14,
      impactAreaName: '765 kV Transmission Corridor Line (38 ha diverted)',
      impactAreaHa: 38.0,
      caPlotName: 'Degraded Forest Compartment P-214 (85 ha)',
      caPlotHa: 85.0,
      coordinatesDisplay: '21°54\'04.3"N 77°54\'08.2"E',
      surveyNumbers: 'Compartment P-214, Amla Range, South Betul Division',
      boundaryCoords: [
        { x: 28, y: 25 },
        { x: 65, y: 22 },
        { x: 75, y: 55 },
        { x: 50, y: 72 },
        { x: 22, y: 58 }
      ],
      impactCoords: [
        { x: 10, y: 15 },
        { x: 88, y: 82 }
      ],
      waterCoords: [
        { x: 50, y: 45 },
        { x: 56, y: 52 }
      ]
    },
    chartData: [
      { date: '2019-10', dateLabel: 'Oct 2019', actualNdvi: 0.28, expectedNdvi: 0.28, baselineNdvi: 0.28, phase: 'Baseline', milestoneAnnotation: 'Pre-clearing baseline' },
      { date: '2020-10', dateLabel: 'Oct 2020', actualNdvi: 0.35, expectedNdvi: 0.34, baselineNdvi: 0.28, phase: 'Planting' },
      { date: '2021-10', dateLabel: 'Oct 2021', actualNdvi: 0.42, expectedNdvi: 0.41, baselineNdvi: 0.28, phase: 'Planting' },
      { date: '2022-10', dateLabel: 'Oct 2022', actualNdvi: 0.49, expectedNdvi: 0.47, baselineNdvi: 0.28, phase: 'Monitoring', milestoneAnnotation: 'First post-monsoon review' },
      { date: '2023-10', dateLabel: 'Oct 2023', actualNdvi: 0.54, expectedNdvi: 0.52, baselineNdvi: 0.28, phase: 'Monitoring' },
      { date: '2024-10', dateLabel: 'Oct 2024', actualNdvi: 0.59, expectedNdvi: 0.56, baselineNdvi: 0.28, phase: 'Monitoring', milestoneAnnotation: '12-month comparison' },
      { date: '2025-07', dateLabel: 'Jul 2025', actualNdvi: 0.61, expectedNdvi: 0.58, baselineNdvi: 0.28, phase: 'Monitoring', milestoneAnnotation: 'Planting deadline' }
    ],
    timeline: [
      {
        id: 'betul-t1',
        date: '14 Oct 2019',
        milestoneLabel: 'Pre-clearing Baseline',
        imageThumbnail: 'satellite_base_betul_2019',
        satelliteLayer: 'true_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.2% cloud cover',
        observation: 'Degraded scrub canopy with exposed rocky outcroppings prior to soil conservation works.',
        status: 'monitoring_required',
        ndviValue: 0.28,
        ndviDelta: 'Baseline (0.00)',
        canopyDensity: '14%',
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '33.5°',
          bandsUsed: 'B04, B03, B02',
          acquisitionDate: '2019-10-14T05:18:22Z',
          sceneId: 'S2A_MSIL2A_20191014T051822_N0213_R076_T43QEB'
        }
      },
      {
        id: 'betul-t2',
        date: '22 Oct 2022',
        milestoneLabel: 'Three-Year Sapling Check',
        imageThumbnail: 'satellite_mid_betul_2022',
        satelliteLayer: 'false_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.5% cloud cover',
        observation: 'Strong near-infrared reflection indicating established deciduous saplings along staggered contour trenches.',
        status: 'likely_recovery',
        ndviValue: 0.49,
        ndviDelta: '+0.21 from baseline',
        canopyDensity: '36%',
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '34.1°',
          bandsUsed: 'B08, B04, B03',
          acquisitionDate: '2022-10-22T05:19:04Z',
          sceneId: 'S2B_MSIL2A_20221022T051904_N0400_R076_T43QEB'
        }
      },
      {
        id: 'betul-t3',
        date: '18 Jul 2025',
        milestoneLabel: 'Mandated Deadline Verification',
        imageThumbnail: 'satellite_latest_betul_2025',
        satelliteLayer: 'ndvi',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.8% cloud cover',
        observation: 'Mean NDVI exceeds target (0.61 vs 0.58). Continuous closed canopy detected over 78.2 ha out of 85 ha.',
        status: 'likely_recovery',
        ndviValue: 0.61,
        ndviDelta: '+0.33 from baseline (Surplus +0.03)',
        canopyDensity: '58%',
        fieldEvidence: {
          available: true,
          inspector: 'DFO South Betul Forest Division',
          notes: 'Ground survival verified at 84.5%. Staggered trenches and check-dams functioning effectively.',
          dateRecorded: '20 Jul 2025'
        },
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '25.6°',
          bandsUsed: 'NDVI (B08-B04)/(B08+B04)',
          acquisitionDate: '2025-07-18T05:17:50Z',
          sceneId: 'S2A_MSIL2A_20250718T051750_N0512_R076_T43QEB'
        }
      }
    ],
    technicalEvidence: {
      canopyCoverPercent: 58.6,
      sarBackscatterDb: '-11.2 dB (indicates dense woody biomass structure)',
      moistureIndex: 0.34,
      cloudFreeObservations: 46,
      sentinelSceneId: 'S2A_MSIL2A_20250718T051750_N0512_R076_T43QEB',
      latLongBBox: '21.8920°N, 77.8910°E to 21.9120°N, 77.9150°E',
      sensorConstellation: 'Copernicus Sentinel-2 & Sentinel-1 C-SAR'
    }
  },
  {
    id: 'raichur-solar-park',
    name: 'Raichur Solar Park Compensatory Plot',
    proponent: 'Karnataka Renewable Energy Development Ltd (KREDL)',
    state: 'Karnataka',
    district: 'Raichur',
    sector: 'Industrial & Renewable',
    status: 'monitoring_required',
    complianceRiskScore: 48,
    riskLevel: 'Medium',
    evidenceConfidenceScore: 82,
    confidenceLevel: 'High',
    forestRecoveryScore: 56,
    complianceScore: 62,
    lastMonitoringDate: '28 Oct 2025 (Sentinel-2 Pass)',
    alertStatus: {
      level: 'warning',
      label: 'Monitoring Alert: Slower Growth',
      confidencePercent: 84,
      summary: 'Partial recovery in low-lying check-dam catchment; upper rocky ridges show moisture stress and growth delay.',
    },
    aiCompliance: {
      modelType: 'Random Forest + LSTM Time-Series Anomaly Detector',
      confidenceScore: 84,
      nonComplianceFlagged: true,
      anomalySeverity: 'Moisture Stress Deficit',
      flags: [
        'Southern ridge sector displays semi-arid moisture stress',
        'Survival rate estimated at 58% vs statutory 75% condition',
        'Recommendation: Supplementary check-dams and remedial drip watering'
      ],
    },
    vegetationAnalytics: {
      currentNdvi: 0.38,
      currentEvi: 0.23,
      baselineNdvi: 0.26,
      baselineEvi: 0.15,
      targetNdvi: 0.50,
      targetEvi: 0.35,
      growthTrend: 'Gradual recovery (+0.12 NDVI delta over 3 years)',
      revisitFrequency: 'Every ~5 days (Sentinel-2 MSI)',
    },
    clearanceFileRef: 'KSEIAA-EC-KA-2022-1944.pdf',
    clearanceDate: '12 January 2022',
    promise: {
      shortClaim: '60 hectares of semi-arid thorn forest restoration by December 2025.',
      deadline: 'December 2025',
      requiredArea: '60 ha (75,000 drought-tolerant native species)',
      sourcePdfPage: 'Clearance PDF, Page 11, Condition 8',
      specificCondition: 'Condition 8: Proponent must plant 75,000 drought-tolerant saplings (Neem, Honge, Subabul) across 60 ha of rocky revenue land in Deodurga Taluka with water-harvesting bunds.',
      saplingCount: '75,000 drought-resilient saplings',
      targetNdvi: 0.50,
      clauseExcerpt: 'Condition 8: Compensatory restoration of 60 ha to be completed before commissioning of solar generation array in December 2025.'
    },
    proof: {
      latestObservation: 'Vegetation establishment delayed by erratic 2023 pre-monsoon precipitation; gradual recovery detected in northern quadrant only.',
      recoveryTrend: 'Gradual recovery (+0.12 NDVI delta over 3 years)',
      evidenceQuality: 'High confidence (Sentinel-2 optical + soil moisture index mapping)',
      plainLanguageExplanation: 'Saplings have established well in the low-lying northern section with check-dams, but upper rocky ridges show severe moisture stress and slower growth.',
      recommendedAction: 'Request Q3 survival rate telemetry and water conservation audit report.',
      currentNdvi: 0.38,
      baselineNdvi: 0.26,
      targetNdvi: 0.50
    },
    mapData: {
      center: [16.2008, 77.3556],
      zoom: 14,
      impactAreaName: 'Solar PV Array Plot (180 ha converted wasteland)',
      impactAreaHa: 180.0,
      caPlotName: 'Deodurga Semi-Arid Restoration Plot (60 ha)',
      caPlotHa: 60.0,
      coordinatesDisplay: '16°12\'02.9"N 77°21\'20.2"E',
      surveyNumbers: 'Sy No. 88, 89, 94, Deodurga Taluka, Raichur',
      boundaryCoords: [
        { x: 35, y: 25 },
        { x: 68, y: 28 },
        { x: 72, y: 60 },
        { x: 48, y: 68 },
        { x: 30, y: 52 }
      ],
      impactCoords: [
        { x: 12, y: 65 },
        { x: 35, y: 62 },
        { x: 38, y: 92 },
        { x: 10, y: 90 }
      ],
      waterCoords: [
        { x: 62, y: 32 },
        { x: 66, y: 38 }
      ]
    },
    chartData: [
      { date: '2022-02', dateLabel: 'Feb 2022', actualNdvi: 0.26, expectedNdvi: 0.26, baselineNdvi: 0.26, phase: 'Baseline', milestoneAnnotation: 'Baseline' },
      { date: '2022-10', dateLabel: 'Oct 2022', actualNdvi: 0.29, expectedNdvi: 0.32, baselineNdvi: 0.26, phase: 'Planting' },
      { date: '2023-10', dateLabel: 'Oct 2023', actualNdvi: 0.31, expectedNdvi: 0.38, baselineNdvi: 0.26, phase: 'Planting', milestoneAnnotation: 'Drought year check' },
      { date: '2024-10', dateLabel: 'Oct 2024', actualNdvi: 0.36, expectedNdvi: 0.44, baselineNdvi: 0.26, phase: 'Monitoring', milestoneAnnotation: '12-month comparison' },
      { date: '2025-10', dateLabel: 'Oct 2025', actualNdvi: 0.38, expectedNdvi: 0.50, baselineNdvi: 0.26, phase: 'Monitoring', milestoneAnnotation: 'Planting deadline' }
    ],
    timeline: [
      {
        id: 'raichur-t1',
        date: '18 Feb 2022',
        milestoneLabel: 'Pre-clearing Baseline',
        imageThumbnail: 'satellite_base_raichur_2022',
        satelliteLayer: 'true_color',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.0% cloud cover',
        observation: 'Arid scrub and black cotton soil interface with seasonal stream bed; baseline NDVI 0.26.',
        status: 'monitoring_required',
        ndviValue: 0.26,
        ndviDelta: 'Baseline (0.00)',
        canopyDensity: '11%',
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '31.8°',
          bandsUsed: 'B04, B03, B02',
          acquisitionDate: '2022-02-18T05:08:12Z',
          sceneId: 'S2A_MSIL2A_20220218T050812_N0400_R076_T43QDA'
        }
      },
      {
        id: 'raichur-t2',
        date: '28 Oct 2024',
        milestoneLabel: 'Post-Monsoon Growth Check',
        imageThumbnail: 'satellite_mid_raichur_2024',
        satelliteLayer: 'ndvi',
        sensor: 'Sentinel-2 MSI',
        cloudCover: '0.4% cloud cover',
        observation: 'Northern check-dam catchment showing positive greening; southern ridges remain dry.',
        status: 'monitoring_required',
        ndviValue: 0.36,
        ndviDelta: '+0.10 from baseline',
        canopyDensity: '22%',
        metadata: {
          resolution: '10m / pixel',
          solarZenith: '34.2°',
          bandsUsed: 'NDVI (B08-B04)/(B08+B04)',
          acquisitionDate: '2024-10-28T05:09:44Z',
          sceneId: 'S2B_MSIL2A_20241028T050944_N0511_R076_T43QDA'
        }
      }
    ],
    technicalEvidence: {
      canopyCoverPercent: 24.1,
      sarBackscatterDb: '-13.1 dB',
      moistureIndex: 0.19,
      cloudFreeObservations: 34,
      sentinelSceneId: 'S2B_MSIL2A_20251028T050944_N0511_R076_T43QDA',
      latLongBBox: '16.1910°N, 77.3420°E to 16.2120°N, 77.3680°E',
      sensorConstellation: 'Copernicus Sentinel-2 MSI'
    }
  }
];
