import React, { useState, useEffect } from 'react';
import { Project, Language, UserProfile, SatelliteScene } from './types';
import { mockProjects } from './data/mockProjects';
import { translations } from './translations';
import { getStoredUser, setStoredUser, PRESET_USERS } from './data/authData';
import { Navbar, NavTab } from './components/Navbar';
import { HeroVisual } from './components/HeroVisual';
import { PipelineView } from './components/PipelineView';
import { SatelliteExplorerView } from './components/SatelliteExplorerView';
import { SettingsView } from './components/SettingsView';
import { DashboardView } from './components/DashboardView';
import { ExecutiveDashboardView } from './components/ExecutiveDashboardView';
import { ExpectedOutcomesView } from './components/ExpectedOutcomesView';
import { ProjectDetailView } from './components/ProjectDetailView';
import { AuthView } from './components/AuthView';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { AboutModal } from './components/AboutModal';
import { AboutSectionView } from './components/AboutSectionView';
import { SourcePdfModal } from './components/SourcePdfModal';
import { useToast } from './context/ToastContext';
import { ShieldCheck, ArrowRight, Layers, KeyRound, UserCheck, Satellite, Sliders } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project>(mockProjects[0]);
  const [detailSubTab, setDetailSubTab] = useState<'overview' | 'gis' | 'shap' | 'whatif' | 'ingest' | 'ml' | 'api' | 'audit'>('overview');
  const [lang, setLang] = useState<Language>('en');

  // Cross-view pipeline state injection
  const [pipelineScene, setPipelineScene] = useState<SatelliteScene | null>(null);
  const [pipelineCoords, setPipelineCoords] = useState<[number, number] | null>(null);
  const [pipelineProjectInfo, setPipelineProjectInfo] = useState<any>(null);

  // Authentication State

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStoredUser());
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [sourcePdfModalOpen, setSourcePdfModalOpen] = useState(false);

  const { toast } = useToast();
  const t = translations[lang];

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthInitialMode(mode);
    setCurrentTab('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setStoredUser(user);
    toast.success(`Welcome, ${user.name}`, {
      message: `Signed in as ${user.roleTitle} (${user.clearanceLevel} clearance). Jurisdiction: ${user.jurisdiction}`,
      duration: 5000,
    });
  };

  const handleLogout = () => {
    const prevName = currentUser?.name;
    setCurrentUser(null);
    setStoredUser(null);
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.info('Session Terminated', {
      message: prevName ? `${prevName} signed out of compliance workstation.` : 'Successfully signed out.',
      duration: 4000,
    });
  };

  const handleSelectProject = (project: Project, subTab: 'overview' | 'gis' | 'shap' | 'whatif' | 'ingest' | 'ml' | 'api' | 'audit' = 'overview') => {
    setSelectedProject(project);
    setDetailSubTab(subTab);
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectLoaded = (project: Project) => {
    // If not already in list, prepend it
    if (!projects.find((p) => p.id === project.id)) {
      setProjects([project, ...projects]);
    }
    setSelectedProject(project);
    setDetailSubTab('overview');
    setCurrentTab('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restrict document uploads to authenticated officers only
  const handleOpenUploadModal = () => {
    if (!currentUser) {
      toast.warning('Authentication Required', {
        message: 'Please sign in or register an official compliance officer account to upload statutory clearance PDFs or GIS shapefiles.',
        duration: 5000,
      });
      handleOpenAuth('login');
      return;
    }
    setUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#12372A] text-white flex flex-col selection:bg-[#3E7C59]/30 selection:text-white transition-colors">
      {/* Universal Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        setLang={setLang}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenUploadModal={handleOpenUploadModal}
        onOpenAboutModal={() => {
          setCurrentTab('about');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HeroVisual
            lang={lang}
            onExploreDemo={() => {
              setCurrentTab('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onUploadPdf={handleOpenUploadModal}
            onLaunchPipeline={() => {
              setCurrentTab('pipeline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            sampleProject={mockProjects[0]}
            onSelectProject={(p) => handleSelectProject(p, 'overview')}
          />
        )}

        {currentTab === 'dashboard' && (
          <ExecutiveDashboardView
            projects={projects}
            lang={lang}
            onSelectProject={(p) => handleSelectProject(p, 'overview')}
            onNavigateToProjects={() => {
              setCurrentTab('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToPipeline={() => {
              setCurrentTab('pipeline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToExplorer={() => {
              setCurrentTab('explorer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenUpload={handleOpenUploadModal}
          />
        )}


        {currentTab === 'outcomes' && (
          <ExpectedOutcomesView
            projects={projects}
            lang={lang}
            onSelectProject={(p) => handleSelectProject(p, 'overview')}
            onNavigateToProjects={() => {
              setCurrentTab('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReport={(p) => handleSelectProject(p, 'overview')}
          />
        )}

        {currentTab === 'explorer' && (
          <SatelliteExplorerView
            lang={lang}
            initialCoordinates={pipelineCoords || undefined}
            onSelectProject={(p) => handleSelectProject(p, 'overview')}
            onSendToPipeline={(scene, coords, plotInfo) => {
              setPipelineScene(scene);
              setPipelineCoords(coords);
              setPipelineProjectInfo(plotInfo);
              setCurrentTab('pipeline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'pipeline' && (
          <PipelineView
            lang={lang}
            injectedScene={pipelineScene}
            injectedCoords={pipelineCoords}
            injectedProject={pipelineProjectInfo}
            onSelectProject={(p) => handleSelectProject(p, 'overview')}
            onOpenUpload={handleOpenUploadModal}
            onBackToHome={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            lang={lang}
            onClose={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'about' && (
          <AboutSectionView
            lang={lang}
            onNavigateToPipeline={() => {
              setCurrentTab('pipeline');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToProjects={() => {
              setCurrentTab('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToExplorer={() => {
              setCurrentTab('explorer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'projects' && (
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
            <DashboardView
              projects={projects}
              lang={lang}
              onSelectProject={(p) => handleSelectProject(p, 'overview')}
              onOpenUpload={handleOpenUploadModal}
            />
          </div>
        )}

        {currentTab === 'detail' && (
          <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
            <ProjectDetailView
              project={selectedProject}
              lang={lang}
              initialTab={detailSubTab}
              onBackToProjects={() => setCurrentTab('projects')}
              onOpenSourcePdfModal={() => setSourcePdfModalOpen(true)}
            />
          </div>
        )}

        {currentTab === 'auth' && (
          <AuthView
            lang={lang}
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onNavigateHome={() => {
              setCurrentTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            initialMode={authInitialMode}
          />
        )}
      </main>

      {/* Calm, Professional Footer */}
      <footer className="no-print border-t bg-[#0E281F] border-white/10 text-white/70">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-12 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white bg-gradient-to-br from-[#1b4e3c] to-[#0e2c21] border border-white/20 shadow-md">
                <Satellite className="w-5 h-5 text-[#A8C3A0]" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#74BDE0] ring-1 ring-[#0E281F]" />
              </div>
              <div>
                <span className="text-lg font-bold font-serif-display block leading-none text-white">
                  Canopy
                </span>
                <span className="text-xs font-medium block mt-0.5 text-[#A8C3A0]">
                  {t.tagline}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white/90">
              <button
                onClick={() => {
                  setCurrentTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {lang === 'en' ? 'Overview' : lang === 'hi' ? 'अवलोकन' : 'आढावा'}
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentTab('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {lang === 'en' ? 'Dashboard' : lang === 'hi' ? 'डैशबोर्ड' : 'डॅशबोर्ड'}
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentTab('explorer');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {lang === 'en' ? 'Satellite Explorer' : lang === 'hi' ? 'उपग्रह एक्सप्लोरर' : 'उपग्रह एक्सप्लोरर'}
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentTab('pipeline');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {t.navPipeline}
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentTab('projects');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {t.navExplore}
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentTab('settings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {lang === 'en' ? 'Settings' : lang === 'hi' ? 'सेटिंग्स' : 'सेटिंग्ज'}
              </button>

              <span>•</span>
              <button
                onClick={() => handleOpenAuth('login')}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0] flex items-center gap-1"
                title="Workstation Authentication"
              >
                <KeyRound size={13} className="text-[#A8C3A0]" />
                <span>Sign In</span>
              </button>
              <span>•</span>
              <button
                onClick={handleOpenUploadModal}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {t.navUpload}
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  setCurrentTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="cursor-pointer transition-colors hover:text-[#A8C3A0]"
              >
                {t.navAbout}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/60">
            <p className="max-w-xl leading-relaxed">
              {t.decisionSupportDisclaimer}
            </p>
            <div className="font-mono text-[11px] text-[#A8C3A0]/80">
              Canopy • Copernicus Sentinel-2 MSI & Sentinel-1 SAR
            </div>
          </div>
        </div>
      </footer>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <UploadDocumentModal
          lang={lang}
          onClose={() => setUploadModalOpen(false)}
          onProjectLoaded={handleProjectLoaded}
          availableProjects={mockProjects}
        />
      )}

      {/* About Platform Modal */}
      {aboutModalOpen && (
        <AboutModal
          lang={lang}
          onClose={() => setAboutModalOpen(false)}
        />
      )}

      {/* Source PDF Clause Modal */}
      {sourcePdfModalOpen && (
        <SourcePdfModal
          project={selectedProject}
          lang={lang}
          onClose={() => setSourcePdfModalOpen(false)}
        />
      )}
    </div>
  );
}
