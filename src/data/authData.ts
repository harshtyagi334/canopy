import { UserProfile, UserRole } from '../types';

export const PRESET_USERS: (UserProfile & { passwordHint: string })[] = [
  {
    id: 'user-moefcc-1',
    name: 'Dr. Aarti Sharma, IFS',
    email: 'aarti.sharma@moefcc.gov.in',
    role: 'moefcc_officer',
    roleTitle: 'Senior Inspector & Regional Director',
    organization: 'Ministry of Environment, Forest & Climate Change (MoEFCC)',
    department: 'Forest Conservation Division (IA-I)',
    badgeNumber: 'IND-IFS-2012-4091',
    jurisdiction: 'Pan-India / Central Authority',
    clearanceLevel: 'Statutory Authority',
    joinedDate: '2021-08-14',
    passwordHint: 'moefcc2026'
  },
  {
    id: 'user-state-1',
    name: 'Rajesh V. Verma',
    email: 'rajesh.verma@mahaforest.gov.in',
    role: 'state_campa_officer',
    roleTitle: 'State CAMPA Nodal Officer & CCF',
    organization: 'Maharashtra State Forest Department',
    department: 'CAMPA Monitoring & Geospatial Wing',
    badgeNumber: 'MH-FD-CAMPA-882',
    jurisdiction: 'Maharashtra State',
    clearanceLevel: 'State Nodal',
    joinedDate: '2022-03-10',
    passwordHint: 'campa123'
  },
  {
    id: 'user-proponent-1',
    name: 'Ananya Roy',
    email: 'ananya.roy@tatapower.com',
    role: 'proponent_esg',
    roleTitle: 'Head of ESG & Regulatory Compliance',
    organization: 'Tata Power Renewable Energy Ltd',
    department: 'Sustainability & Statutory Affairs',
    badgeNumber: 'ESG-PRO-9921',
    jurisdiction: 'Western & Central Projects',
    clearanceLevel: 'Proponent ESG',
    joinedDate: '2023-01-22',
    passwordHint: 'esgpass2026'
  },
  {
    id: 'user-auditor-1',
    name: 'Dr. Vikramaditya Sen',
    email: 'v.sen@wii.gov.in',
    role: 'independent_auditor',
    roleTitle: 'Lead Geospatial Auditor',
    organization: 'Wildlife Institute of India / NABET Accredited',
    department: 'Remote Sensing & Ecological Impact Cell',
    badgeNumber: 'NABET-AUD-041',
    jurisdiction: 'National Ecological Corridors',
    clearanceLevel: 'Accredited Auditor',
    joinedDate: '2022-11-05',
    passwordHint: 'audit789'
  }
];

const AUTH_STORAGE_KEY = 'vanguard_ai_active_user_v2';
const REGISTERED_USERS_KEY = 'vanguard_ai_registered_users_v2';

export const getStoredUser = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as UserProfile;
    }
  } catch (e) {
    console.error('Failed to load user from localStorage', e);
  }
  return null;
};

export const setStoredUser = (user: UserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
};

export const getRegisteredUsers = (): UserProfile[] => {
  try {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (data) {
      return JSON.parse(data) as UserProfile[];
    }
  } catch (e) {
    console.error('Failed to load registered users', e);
  }
  return [];
};

export const saveNewRegisteredUser = (user: UserProfile) => {
  try {
    const current = getRegisteredUsers();
    const updated = [user, ...current.filter((u) => u.email.toLowerCase() !== user.email.toLowerCase())];
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save registered user', e);
  }
};
