import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { CandidateList } from '@/components/CandidateList';
import { Candidate } from '@/types/candidate';
import { Moon, Sun, Users, Database, Settings } from 'lucide-react';
import rawApplications from '../test.applications.json';
import { Button } from '@/components/ui/button';
import Leaderboards from '@/components/Leaderboards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToastProvider } from '@/components/ui/toaster';
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

  // Immediately load normalized dataset from the provided test export
  const initialCandidates: Candidate[] = Array.isArray(rawApplications) ? rawApplications.map((r: any) => normalizeApplication(r)) : [];
  console.log('Loaded applications from test.applications.json:', initialCandidates.length);

  const [state, setState] = useState<AppState>({
    candidates: initialCandidates,
    loading: false,
    error: null,
    darkMode: false
  });

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

                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <MainView candidates={state.candidates} loading={state.loading} />
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
