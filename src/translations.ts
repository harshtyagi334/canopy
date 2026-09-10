import { Language, ProjectStatus } from './types';

export interface Translations {
  appName: string;
  tagline: string;
  navExplore: string;
  navUpload: string;
  navDashboard: string;
  navAbout: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubheadline: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  trustStatement: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  promiseVsProofHeading: string;
  promiseLabel: string;
  proofLabel: string;
  sourceReference: string;
  requiredArea: string;
  deadline: string;
  recoveryTrend: string;
  evidenceConfidence: string;
  recommendedAction: string;
  complianceRiskScore: string;
  downloadReport: string;
  proofTimelineTitle: string;
  proofTimelineSubtitle: string;
  viewDetails: string;
  technicalEvidenceTitle: string;
  technicalEvidenceSubtitle: string;
  mapTitle: string;
  mapSubtitle: string;
  ndviChartTitle: string;
  ndviChartSubtitle: string;
  statusLabels: Record<ProjectStatus, string>;
  filterByState: string;
  filterBySector: string;
  filterByStatus: string;
  allStates: string;
  allSectors: string;
  allStatuses: string;
  searchPlaceholder: string;
  viewProject: string;
  proponentLabel: string;
  stateLabel: string;
  sectorLabel: string;
  expandTechnical: string;
  collapseTechnical: string;
  decisionSupportDisclaimer: string;
  close: string;
  backToProjects: string;
  uploadModalTitle: string;
  uploadModalSubtitle: string;
  dropzoneText: string;
  dropzoneSubtext: string;
  demoPdfBtn: string;
  analyzingDocument: string;
  reportTitle: string;
  reportSubtitle: string;
  reportProjectSummary: string;
  reportTimelineEvidence: string;
  reportTimelineSubtitle: string;
  reportRiskVerdict: string;
  reportRiskVerdictSubtitle: string;
  reportPrintPdf: string;
  reportPrintHint: string;
  reportGeneratedBy: string;
  reportStatutoryRecommendation: string;
  reportRiskLevel: string;
  reportConfidenceLevel: string;
  layoutSplit: string;
  layoutFullGreen: string;
  liveEvidencePreview: string;
  navPipeline: string;
  exportFiles: string;
  navOutcomes: string;
  whatIsVanGuard: string;
  whyImportant: string;
  howItWorks: string;
  statutoryJurisdiction: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Canopy: Where Did the Compensatory Forest Go?',
    tagline: 'Tracing every cleared forest to its promised replacement — and verifying, from orbit, whether the promise was kept.',
    navExplore: 'Explore Projects',
    navUpload: 'Upload Document',
    navDashboard: 'Dashboard',
    navAbout: 'About',
    navPipeline: 'Evidence Pipeline',
    navOutcomes: 'Expected Outcomes',
    exportFiles: 'Export Files',
    whatIsVanGuard: 'What is Canopy?',
    whyImportant: 'Why Canopy Matters',
    howItWorks: 'How Canopy Works',
    statutoryJurisdiction: 'Statutory Jurisdiction & Mandates',
    heroHeadline1: 'Environmental Promises on Paper.',
    heroHeadline2: 'Proof Visible from Space.',
    heroSubheadline: 'Canopy traces every cleared forest to its promised replacement and verifies, from orbit, whether the promise was kept.',
    heroPrimaryCta: 'Explore a Demo Project',
    heroSecondaryCta: 'Upload Clearance PDF',
    trustStatement: 'Evidence-first. Explainable. Designed to support field verification.',
    howItWorksTitle: 'How Canopy Works',
    step1Title: 'Link Every Project to Its Land',
    step1Desc: 'Automatically connects each forest-clearance approval to its designated compensatory afforestation (CA) parcel — closing today’s paperwork gap.',
    step2Title: 'Monitor Recovery Over Time',
    step2Desc: 'Tracks vegetation health (NDVI & EVI) and canopy cover on CA land using satellite imagery time series, not one-off snapshots.',
    step3Title: 'Flag Non-Compliance Early',
    step3Desc: 'Surfaces CA sites with little or no vegetation recovery for regulatory review — years sooner than delayed manual audits.',
    promiseVsProofHeading: 'Promise vs Proof',
    promiseLabel: 'PROMISE (What the document says)',
    proofLabel: 'PROOF (Latest satellite & field evidence)',
    sourceReference: 'Source Reference',
    requiredArea: 'Required Area',
    deadline: 'Mandated Deadline',
    recoveryTrend: 'Recovery Trend',
    evidenceConfidence: 'Evidence Confidence',
    recommendedAction: 'Recommended Action',
    complianceRiskScore: 'Compliance-Risk Score',
    downloadReport: 'Download Evidence Report',
    proofTimelineTitle: 'ProofTimeline™',
    proofTimelineSubtitle: 'Multi-temporal satellite passes and ground observations over the compensatory plot',
    viewDetails: 'Inspect Evidence',
    technicalEvidenceTitle: 'Technical Evidence & Remote Sensing Data',
    technicalEvidenceSubtitle: 'Radar backscatter, surface reflectance, and sensor metadata for scientific scrutiny',
    mapTitle: 'Interactive Site Geography',
    mapSubtitle: 'Clearly demarcated project impact area vs compensatory afforestation plot',
    ndviChartTitle: 'Vegetation Recovery Trajectory (NDVI)',
    ndviChartSubtitle: 'Historical greenness trend line against mandated target and baseline index',
    statusLabels: {
      likely_recovery: 'Likely recovery',
      monitoring_required: 'Monitoring required',
      evidence_discrepancy: 'Evidence discrepancy',
      field_verification_priority: 'Field verification priority',
      insufficient_evidence: 'Insufficient evidence'
    },
    filterByState: 'State',
    filterBySector: 'Sector',
    filterByStatus: 'Status',
    allStates: 'All States',
    allSectors: 'All Sectors',
    allStatuses: 'All Statuses',
    searchPlaceholder: 'Search projects by name, agency, or district...',
    viewProject: 'View Project Evidence',
    proponentLabel: 'Project Proponent',
    stateLabel: 'State & District',
    sectorLabel: 'Sector',
    expandTechnical: 'Expand Technical Evidence',
    collapseTechnical: 'Hide Technical Evidence',
    decisionSupportDisclaimer: 'Decision-support only. Field verification required for final regulatory determinations.',
    close: 'Close',
    backToProjects: 'Projects',
    uploadModalTitle: 'Analyze Environmental Clearance Letter',
    uploadModalSubtitle: 'Extract afforestation clauses, target coordinates, and verify satellite recovery history',
    dropzoneText: 'Drag & drop MoEFCC or Forest Clearance PDF here',
    dropzoneSubtext: 'or click to browse local files (Supports Form A/B, Stage-I & Stage-II letters)',
    demoPdfBtn: 'Load Sample Clearance PDF',
    analyzingDocument: 'Reading clearance PDF conditions and mapping geo-coordinates...',
    reportTitle: 'Environmental Compliance & Afforestation Audit Report',
    reportSubtitle: 'Multi-Temporal Earth Observation & Statutory Verification Dossier',
    reportProjectSummary: 'Project Summary & Clearance Mandate',
    reportTimelineEvidence: 'Multi-Temporal Timeline Evidence Cards',
    reportTimelineSubtitle: 'Consecutive satellite passes, multispectral indices, and ground truth logs',
    reportRiskVerdict: 'Compliance Risk Verdict & Statutory Action',
    reportRiskVerdictSubtitle: 'Empirical risk level, confidence assessment, and recommended regulatory mandate',
    reportPrintPdf: 'Print / Save as PDF',
    reportPrintHint: 'Select "Save as PDF" as the destination in your print dialog to download.',
    reportGeneratedBy: 'Generated by Canopy: Where Did the Compensatory Forest Go? — Autonomous Verification Platform',
    reportStatutoryRecommendation: 'Recommended Statutory Action',
    reportRiskLevel: 'Risk Level',
    reportConfidenceLevel: 'Evidence Confidence',
    layoutSplit: 'Half Green & Half Beige',
    layoutFullGreen: 'Full Green Screen',
    liveEvidencePreview: 'Live Satellite Evidence & Pipeline'
  },
  hi: {
    appName: 'कैनोपी: व्हेयर डिड द कम्पेन्सेटरी फॉरेस्ट गो?',
    tagline: 'काटे गए प्रत्येक वन का उसके प्रतिपूरक वनीकरण से मिलान — और अंतरिक्ष से सत्यापन कि क्या वादा निभाया गया।',
    navExplore: 'परियोजनाएं देखें',
    navUpload: 'दस्तावेज़ अपलोड करें',
    navDashboard: 'डैशबोर्ड',
    navAbout: 'परिचय',
    navPipeline: 'सत्यापन पाइपलाइन',
    navOutcomes: 'अपेक्षित परिणाम',
    exportFiles: 'फाइलें निर्यात करें',
    whatIsVanGuard: 'कैनोपी क्या है?',
    whyImportant: 'कैनोपी क्यों आवश्यक है?',
    howItWorks: 'कैनोपी कैसे काम करता है',
    statutoryJurisdiction: 'वैधानिक अधिकार क्षेत्र एवं निर्देश',
    heroHeadline1: 'कागज़ पर किए गए पर्यावरणीय वादे।',
    heroHeadline2: 'अंतरिक्ष से दिखने वाला प्रमाण।',
    heroSubheadline: 'कैनोपी काटे गए प्रत्येक वन का उसके प्रतिपूरक वनीकरण से मिलान करता है — और अंतरिक्ष से सत्यापित करता है कि क्या वादा निभाया गया।',
    heroPrimaryCta: 'डेमो परियोजना देखें',
    heroSecondaryCta: 'मंजूरी पत्र (PDF) अपलोड करें',
    trustStatement: 'साक्ष्य-आधारित। पारदर्शी। मैदानी सत्यापन को सशक्त बनाने के लिए निर्मित।',
    howItWorksTitle: 'कैनोपी कैसे काम करता है',
    step1Title: 'प्रत्येक परियोजना को उसकी भूमि से जोड़ना',
    step1Desc: 'स्वीकृत वन स्वीकृति पत्रों (MoEFCC) से अनिवार्य क्षतिपूरक वनीकरण भूखंड का सीधा जुड़ाव — कागजी अंतर को समाप्त करता है।',
    step2Title: 'समय के साथ बहाली की सतत निगरानी',
    step2Desc: 'सेंटीनेल-2 उपग्रह चित्रों द्वारा वन आवरण व हरियाली सूचकांक (NDVI/EVI) का समय-श्रृंखला विश्लेषण।',
    step3Title: 'गैर-अनुपालन की शीघ्र पहचान',
    step3Desc: 'कम अथवा शून्य वन बहाली वाले भूखंडों को विनियामकों हेतु स्वतः चिन्हित करना — वर्षों पुराने विलंब से मुक्ति।',
    promiseVsProofHeading: 'वादा बनाम प्रमाण (Promise vs Proof)',
    promiseLabel: 'वादा (आधिकारिक दस्तावेज़ के अनुसार)',
    proofLabel: 'प्रमाण (उपग्रह एवं ज़मीनी साक्ष्य)',
    sourceReference: 'दस्तावेज़ संदर्भ',
    requiredArea: 'आवश्यक क्षेत्रफल',
    deadline: 'निर्धारित समय-सीमा',
    recoveryTrend: 'बहाली की प्रवृत्ति',
    evidenceConfidence: 'साक्ष्य विश्वसनीयता',
    recommendedAction: 'अनुशंसित अगली कार्रवाई',
    complianceRiskScore: 'अनुपालन जोखिम स्कोर',
    downloadReport: 'साक्ष्य रिपोर्ट डाउनलोड करें',
    proofTimelineTitle: 'प्रमाण समयरेखा (ProofTimeline™)',
    proofTimelineSubtitle: 'क्षतिपूरक वनीकरण स्थल के समयबद्ध उपग्रह चित्र और ज़मीनी अवलोकन',
    viewDetails: 'साक्ष्य विवरण देखें',
    technicalEvidenceTitle: 'तकनीकी साक्ष्य एवं सुदूर संवेदन डेटा',
    technicalEvidenceSubtitle: 'रडार बैकस्कैटर, एनडीवीआई सूचकांक और उपग्रह सेंसर मेटाडेटा',
    mapTitle: 'परियोजना एवं वनीकरण मानचित्र',
    mapSubtitle: 'प्रभावित क्षेत्र बनाम क्षतिपूरक वनीकरण भूखंड का स्पष्ट सीमांकन',
    ndviChartTitle: 'वनस्पतिक बहाली प्रक्षेपवक्र (NDVI)',
    ndviChartSubtitle: 'लक्ष्य और आधारभूत स्तर के सापेक्ष ऐतिहासिक हरियाली का रुझान',
    statusLabels: {
      likely_recovery: 'संभावित सुधार (Likely recovery)',
      monitoring_required: 'निगरानी आवश्यक (Monitoring required)',
      evidence_discrepancy: 'साक्ष्य में विसंगति (Evidence discrepancy)',
      field_verification_priority: 'मैदानी सत्यापन प्राथमिकता (Field verification priority)',
      insufficient_evidence: 'अपर्याप्त साक्ष्य (Insufficient evidence)'
    },
    filterByState: 'राज्य',
    filterBySector: 'क्षेत्र',
    filterByStatus: 'स्थिति',
    allStates: 'सभी राज्य',
    allSectors: 'सभी क्षेत्र',
    allStatuses: 'सभी स्थितियां',
    searchPlaceholder: 'परियोजना, एजेंसी या जिले के नाम से खोजें...',
    viewProject: 'साक्ष्य देखें',
    proponentLabel: 'परियोजना प्रस्तावक',
    stateLabel: 'राज्य एवं जिला',
    sectorLabel: 'क्षेत्र',
    expandTechnical: 'तकनीकी साक्ष्य विस्तार से देखें',
    collapseTechnical: 'तकनीकी साक्ष्य छुपाएं',
    decisionSupportDisclaimer: 'केवल निर्णय-समर्थन हेतु। अंतिम विनियामक निर्धारण के लिए ज़मीनी सत्यापन आवश्यक है।',
    close: 'बंद करें',
    backToProjects: 'परियोजनाएं',
    uploadModalTitle: 'पर्यावरण मंजूरी पत्र का विश्लेषण',
    uploadModalSubtitle: 'वनीकरण शर्तें, अक्षांश-देशांतर और उपग्रह साक्ष्य तुरंत जांचें',
    dropzoneText: 'MoEFCC अथवा वन स्वीकृति पत्र (PDF) यहां खींचें',
    dropzoneSubtext: 'या अपनी फ़ाइल चुनें (Form A/B, Stage-I & Stage-II पत्र)',
    demoPdfBtn: 'नमूना मंजूरी पत्र लोड करें',
    analyzingDocument: 'दस्तावेज़ की शर्तें पढ़ी जा रही हैं और उपग्रह डेटा मैप हो रहा है...',
    reportTitle: 'पर्यावरण अनुपालन एवं वनीकरण लेखापरीक्षा रिपोर्ट',
    reportSubtitle: 'भू-अवलोकन उपग्रह एवं वैधानिक सत्यापन दस्तावेज',
    reportProjectSummary: 'परियोजना सारांश एवं मंजूरी की शर्तें',
    reportTimelineEvidence: 'समयबद्ध साक्ष्य कार्ड (Timeline Evidence Cards)',
    reportTimelineSubtitle: 'उपग्रह तस्वीरें, वानस्पतिक सूचकांक एवं ज़मीनी निरीक्षण रिकॉर्ड',
    reportRiskVerdict: 'अनुपालन जोखिम निष्कर्ष एवं वैधानिक कार्रवाई',
    reportRiskVerdictSubtitle: 'जोखिम स्तर, साक्ष्य विश्वसनीयता और अनुशंसित विनियामक निर्देश',
    reportPrintPdf: 'प्रिंट / PDF के रूप में सहेजें',
    reportPrintHint: 'डाउनलोड करने के लिए प्रिंट विंडो में "Save as PDF" विकल्प चुनें।',
    reportGeneratedBy: 'कैनोपी स्वायत्त सत्यापन मंच द्वारा निर्मित (Canopy)',
    reportStatutoryRecommendation: 'अनुशंसित वैधानिक कार्रवाई',
    reportRiskLevel: 'जोखिम स्तर',
    reportConfidenceLevel: 'साक्ष्य विश्वसनीयता',
    layoutSplit: 'आधा हरा व आधा बेज',
    layoutFullGreen: 'पूर्ण हरा स्क्रीन',
    liveEvidencePreview: 'लाइव उपग्रह साक्ष्य एवं पाइपलाइन'
  },
  mr: {
    appName: 'कॅनोपी: व्हेअर डिड द कम्पेन्सेटरी फॉरेस्ट गो?',
    tagline: 'तोडलेल्या प्रत्येक जंगलाचा भरपाई वनीकरणाशी ताळमेळ — आणि अवकाशातून पडताळणी की दिलेले आश्वासन पाळले गेले का.',
    navExplore: 'प्रकल्प पाहा',
    navUpload: 'कागदपत्र अपलोड करा',
    navDashboard: 'डॅशबोर्ड',
    navAbout: 'माहिती',
    navPipeline: 'पडताळणी पाइपलाइन',
    navOutcomes: 'अपेक्षित परिणाम',
    exportFiles: 'फायली निर्यात करा',
    whatIsVanGuard: 'कॅनोपी म्हणजे काय?',
    whyImportant: 'कॅनोपी का आवश्यक आहे?',
    howItWorks: 'कॅनोपी कसे कार्य करते',
    statutoryJurisdiction: 'वैधानिक अधिकारक्षेत्र व आदेश',
    heroHeadline1: 'कागदावरील पर्यावरणीय आश्वासने.',
    heroHeadline2: 'अवकाशातून दिसणारा ठोस पुरावा.',
    heroSubheadline: 'कॅनोपी तोडलेल्या प्रत्येक जंगलाचा भरपाई वनीकरणाशी ताळमेळ ठेवते — आणि अवकाशातून पडताळते की दिलेले आश्वासन पाळले गेले का.',
    heroPrimaryCta: 'डेमो प्रकल्प पाहा',
    heroSecondaryCta: 'मंजूरी पत्र (PDF) जोडा',
    trustStatement: 'पुराव्यावर आधारित. पारदर्शक. प्रत्यक्ष क्षेत्रीय पडताळणीस साहाय्य करण्यासाठी विकसित.',
    howItWorksTitle: 'कॅनोपी कसे कार्य करते',
    step1Title: 'प्रत्येक प्रकल्पाची जमिनीशी सांगड',
    step1Desc: 'अधिकृत वन मंजुरी पत्रांमधून भरपाई वनीकरण क्षेत्राचा थेट नकाशा — कागदपत्रांमधील अंतर दूर करते.',
    step2Title: 'कालक्रमानुसार पुनर्प्राप्तीचे निरीक्षण',
    step2Desc: 'सेंटीनेल-2 उपग्रहांच्या साहाय्याने वनीकरणाची प्रत्यक्ष वाढ व निर्देशांक (NDVI/EVI) तपासते.',
    step3Title: 'गैर-अनुपालनाची पूर्वसूचना',
    step3Desc: 'कमी वाढ दर्शविणाऱ्या भूखंडांची विनियामकांसाठी त्वरित सूचना — प्रत्यक्ष तपासणीस वेग देते.',
    promiseVsProofHeading: 'आश्वासन विरुद्ध पुरावा (Promise vs Proof)',
    promiseLabel: 'आश्वासन (कागदपत्रांनुसार)',
    proofLabel: 'पुरावा (उपग्रह व क्षेत्रीय पुरावा)',
    sourceReference: 'कागदपत्राचा संदर्भ',
    requiredArea: 'आवश्यक क्षेत्रफळ',
    deadline: 'नियत मुदत',
    recoveryTrend: 'पुनर्प्राप्तीचा कल',
    evidenceConfidence: 'पुराव्याची विश्वासार्हता',
    recommendedAction: 'शिफारस केलेली पुढील कृती',
    complianceRiskScore: 'अनुपालन जोखीम गुण',
    downloadReport: 'पुरावा अहवाल डाउनलोड करा',
    proofTimelineTitle: 'पुरावा कालक्रम (ProofTimeline™)',
    proofTimelineSubtitle: 'भरपाई वनीकरण भूखंडाची कालक्रमानुसार उपग्रह छायाचित्रे व नोंदी',
    viewDetails: 'सविस्तर पुरावा पाहा',
    technicalEvidenceTitle: 'तांत्रिक पुरावा आणि रिमोट सेन्सिंग डेटा',
    technicalEvidenceSubtitle: 'रडार बॅकस्कॅटर, एनडीव्हीआय निर्देशांक व उपग्रह सेन्सर माहिती',
    mapTitle: 'प्रकल्प व वनीकरण नकाशा',
    mapSubtitle: 'प्रभावित क्षेत्र आणि भरपाई वनीकरण क्षेत्राचे स्पष्ट सीमांकन',
    ndviChartTitle: 'वनस्पती वाढीचा आलेख (NDVI)',
    ndviChartSubtitle: 'मुळ निर्देशांक व लक्ष्याच्या तुलनेत प्रत्यक्ष हरित वाढीचा कल',
    statusLabels: {
      likely_recovery: 'संभाव्य सुधारणा (Likely recovery)',
      monitoring_required: 'निरीक्षण आवश्यक (Monitoring required)',
      evidence_discrepancy: 'पुराव्यामध्ये तफावत (Evidence discrepancy)',
      field_verification_priority: 'क्षेत्रीय पडताळणी प्राधान्य (Field verification priority)',
      insufficient_evidence: 'अपुरा पुरावा (Insufficient evidence)'
    },
    filterByState: 'राज्य',
    filterBySector: 'क्षेत्र',
    filterByStatus: 'स्थिती',
    allStates: 'सर्व राज्ये',
    allSectors: 'सर्व क्षेत्रे',
    allStatuses: 'सर्व स्थिती',
    searchPlaceholder: 'प्रकल्प, संस्था किंवा जिल्ह्यानुसार शोधा...',
    viewProject: 'पुरावा पाहा',
    proponentLabel: 'प्रकल्प प्रस्तावक',
    stateLabel: 'राज्य व जिल्हा',
    sectorLabel: 'क्षेत्र',
    expandTechnical: 'तांत्रिक पुरावा उघडा',
    collapseTechnical: 'तांत्रिक पुरावा बंद करा',
    decisionSupportDisclaimer: 'केवळ निर्णय-समर्थनासाठी. अंतिम विनियामक निर्णयासाठी प्रत्यक्ष क्षेत्रीय तपासणी अनिवार्य आहे.',
    close: 'बंद करा',
    backToProjects: 'प्रकल्प',
    uploadModalTitle: 'पर्यावरण मंजुरी पत्राचे विश्लेषण',
    uploadModalSubtitle: 'वनीकरण अटी, भू-निर्देशांक व उपग्रह पुरावा त्वरित तपासा',
    dropzoneText: 'MoEFCC किंवा वन मंजुरी पत्र (PDF) येथे टाका',
    dropzoneSubtext: 'किंवा फाईल निवडा (Form A/B, Stage-I व Stage-II पत्र)',
    demoPdfBtn: 'नमुना मंजुरी पत्र लोड करा',
    analyzingDocument: 'दस्तऐवजातील अटी वाचल्या जात आहेत व उपग्रह माहिती तपासली जात आहे...',
    reportTitle: 'पर्यावरण अनुपालन व वनीकरण तपासणी अहवाल',
    reportSubtitle: 'उपग्रह निरीक्षण व वैधानिक पडताळणी दस्तऐवज',
    reportProjectSummary: 'प्रकल्प सारांश व मंजुरी अटी',
    reportTimelineEvidence: 'कालक्रमानुसार पुरावा कार्डे (Timeline Evidence Cards)',
    reportTimelineSubtitle: 'उपग्रह निरीक्षणे, वनस्पती निर्देशांक आणि क्षेत्रीय नोंदी',
    reportRiskVerdict: 'अनुपालन जोखीम निकाल व वैधानिक कृती',
    reportRiskVerdictSubtitle: 'जोखीम पातळी, पुराव्याची खात्री आणि शिफारस केलेले विनियामक आदेश',
    reportPrintPdf: 'प्रिंट / PDF म्हणून सेव्ह करा',
    reportPrintHint: 'डाउनलोड करण्यासाठी प्रिंट विंडोमध्ये "Save as PDF" निवडा.',
    reportGeneratedBy: 'जिओऑडिट एआई स्वायत्त पडताळणी मंचाद्वारे निर्मित',
    reportStatutoryRecommendation: 'शिफारस केलेली वैधानिक कृती',
    reportRiskLevel: 'जोखीम पातळी',
    reportConfidenceLevel: 'पुराव्याची विश्वासार्हता',
    layoutSplit: 'अर्धा हिरवा व अर्धा बेज',
    layoutFullGreen: 'पूर्ण हिरवी स्क्रीन',
    liveEvidencePreview: 'थेट उपग्रह पुरावा व पाइपलाइन'
  }
};
