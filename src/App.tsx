import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { CandidateList } from '@/components/CandidateList';
import { Candidate } from '@/types/candidate';
import { Moon, Sun, Users, Database, Settings } from 'lucide-react';
// Fetch applications from backend instead of bundling local JSON.
// Backend base URL can be configured with Vite env var VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';
import { Button } from '@/components/ui/button';
import Leaderboards from '@/components/Leaderboards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToastProvider } from '@/components/ui/toaster';
import SignIn from '@/components/SignIn';
import './App.css';

// NOTE: we'll use the provided `test.applications.json` dataset (rawApplications)

interface AppState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  darkMode: boolean;
}

const App: React.FC = () => {
  // Normalize raw Mongo export (handles {$oid} and {$date} formats)
  const normalizeApplication = (a: any): Candidate => {
    const id = a._id?.$oid ?? a._id ?? a.id ?? String(Math.random());
    const createdAt = a.createdAt?.$date ?? a.createdAt ?? '';
    const updatedAt = a.updatedAt?.$date ?? a.updatedAt ?? '';

    const societyRaw = (a.society ?? a.soc ?? '').toString().trim();
    const society = (!societyRaw || /^(na|n\/a|none|no society yet|na\*?)$/i.test(societyRaw)) ? 'N/A' : societyRaw;

    const softSkills = Array.isArray(a.softSkills) ? a.softSkills : (a.softSkills ? String(a.softSkills).split(/[,\n]+/).map((s: string) => s.trim()).filter(Boolean) : []);
    const hardSkills = Array.isArray(a.hardSkills) ? a.hardSkills : (a.hardSkills ? String(a.hardSkills).split(/[,\n]+/).map((s: string) => s.trim()).filter(Boolean) : []);

    return {
      _id: id,
      name: a.name ?? '',
      rollNo: a.rollNo ?? '',
      branch: a.branch ?? '',
      year: a.year ?? '',
      phone: a.phone ?? '',
      email: a.email ?? '',
      society,
      whyJoin: a.whyJoin ?? '',
      softSkills,
      hardSkills,
      projectLink: a.projectLink ?? '',
      imageUrl: a.imageUrl ?? '',
      githubProfile: a.githubProfile ?? '',
      residence: a.residence ?? '',
      createdAt: createdAt,
      updatedAt: updatedAt,
      __v: typeof a.__v === 'number' ? a.__v : 0
    };
  };

  const [state, setState] = useState<AppState>({
    candidates: [],
    loading: true,
    error: null,
    darkMode: false,
  });

  // Authentication (simple client-only signin)
  const STORAGE_KEY = 'flux_current_user';
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_e) {
      return null;
    }
  });

  // Fetch applications from backend (merged scores + application details) AFTER sign-in
  useEffect(() => {
    if (!currentUser) return; // don't fetch until signed in

    let mounted = true;

    const fetchCandidates = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const raterParam = encodeURIComponent(currentUser ?? '');
        const res = await fetch(`${API_BASE}/api/scores/all-with-details${raterParam ? `?rater=${raterParam}` : ''}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const merged = await res.json();

        const apps = Array.isArray(merged)
          ? merged.map((m: any) => (m && m.application ? m.application : m))
          : [];

        const normalized: Candidate[] = apps.map((a: any) => normalizeApplication(a));

        if (!mounted) return;
        setState((s) => ({ ...s, candidates: normalized, loading: false }));
        console.log('Loaded applications from backend:', normalized.length);
      } catch (err: any) {
        console.error('Failed to load applications from backend', err);
        if (!mounted) return;
        setState((s) => ({ ...s, loading: false, error: String(err) }));
      }
    };

    fetchCandidates();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const handleSignIn = (username: string) => {
    setCurrentUser(username);
    try {
      localStorage.setItem(STORAGE_KEY, username);
    } catch (_e) {}
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_e) {}
  };

  // Dark mode toggle
  const toggleDarkMode = (): void => {
    setState((prev: AppState) => ({ ...prev, darkMode: !prev.darkMode }));
    document.documentElement.classList.toggle('dark');
  };

  // Calculate dashboard statistics
  const stats = React.useMemo(() => {
    return {
      totalCandidates: state.candidates.length,
  branches: new Set(state.candidates.map((c: Candidate) => c.branch)).size,
  years: new Set(state.candidates.map((c: Candidate) => c.year)).size,
  withSociety: state.candidates.filter((c: Candidate) => c.society !== 'N/A').length
    };
  }, [state.candidates]);

  return (
    <ToastProvider>
      <div className={`min-h-screen transition-colors duration-300 ${state.darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Header Navigation */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h1 className="text-xl font-bold">Flux Candidate Platform</h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sorting & Judgement System
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quick Stats */}
                  <div className="hidden md:flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">{stats.totalCandidates} Candidates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{stats.branches} Branches</Badge>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                    {state.darkMode ? (
                      <Sun className="h-4 w-4" />
                    ) : (
                      <Moon className="h-4 w-4" />
                    )}
                  </Button>

                  {currentUser ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm hidden sm:inline">Signed in: <strong>{currentUser}</strong></span>
                      <Button variant="outline" size="sm" onClick={handleSignOut}>Sign out</Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {!currentUser ? (
              <SignIn onSignIn={handleSignIn} />
            ) : (
              <MainView candidates={state.candidates} loading={state.loading} />
            )}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;

// Small wrapper to toggle between CandidateList and Leaderboards from the header
function MainView({ candidates, loading }: { candidates: Candidate[]; loading: boolean }) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-end">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowLeaderboard(false)}>Candidates</Button>
          <Button variant="outline" size="sm" onClick={() => setShowLeaderboard(true)}>Leaderboards</Button>
        </div>
      </div>

      {showLeaderboard ? (
        <Leaderboards />
      ) : (
        <CandidateList candidates={candidates} loading={loading} />
      )}
    </div>
  );
}
