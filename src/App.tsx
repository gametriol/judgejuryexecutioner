import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { CandidateList } from '@/components/CandidateList';
import { Candidate } from '@/types/candidate';
import { Moon, Sun, Users, Database, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToastProvider } from '@/components/ui/toaster';
import './App.css';

// Mock data - replace with your MongoDB API calls
const mockCandidates: Candidate[] = [
  {
    "_id": "68d6c4750b6303e94807dbc5",
    "name": "Devansh Kumar Yadav",
    "rollNo": "2024021325",
    "branch": "CSE",
    "year": "2nd Year",
    "phone": "8542969484",
    "email": "dkyadav020806@gmail.com",
    "society": "N/A",
    "whyJoin": "After joining Flux I aim to enhance my programming skills under guidance of experienced seniors and contribute to innovative projects that can make a real impact in the tech community.",
    "softSkills": ["Communication", "Teamwork", "Problem Solving", "Leadership", "Adaptability"],
    "hardSkills": ["Python", "Machine Learning", "Data Structures", "Algorithms"],
    "projectLink": "https://github.com/devansh/ml-project",
    "imageUrl": "https://res.cloudinary.com/dykj0kqay/image/upload/v1758905459/bvqquwvq.jpg",
    "githubProfile": "https://github.com/devansh-yadav, https://leetcode.com/u/zDp9abLRtJ/, https://www.codechef.com/users/devansh",
    "residence": "Gorakhpur, Uttar Pradesh",
    "createdAt": "2025-09-26T16:51:01.074+00:00",
    "updatedAt": "2025-09-26T16:51:01.074+00:00",
    "__v": 0
  },
  {
    "_id": "68d6c4750b6303e94807dbc6",
    "name": "Priya Sharma",
    "rollNo": "2024021326",
    "branch": "ECE",
    "year": "3rd Year",
    "phone": "9876543210",
    "email": "priya.sharma@example.com",
    "society": "Tech Club",
    "whyJoin": "I want to join Flux to work on cutting-edge technology projects and collaborate with like-minded individuals who are passionate about innovation.",
    "softSkills": ["Leadership", "Public Speaking", "Creative Thinking", "Time Management"],
    "hardSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
    "projectLink": "https://github.com/priya/web-app",
    "imageUrl": "https://res.cloudinary.com/dykj0kqay/image/upload/v1758905459/priya.jpg",
    "githubProfile": "https://github.com/priya-sharma, https://leetcode.com/u/priya123/",
    "residence": "Delhi, India",
    "createdAt": "2025-09-26T17:15:01.074+00:00",
    "updatedAt": "2025-09-26T17:15:01.074+00:00",
    "__v": 0
  },
  {
    "_id": "68d6c4750b6303e94807dbc7",
    "name": "Arjun Patel",
    "rollNo": "2024021327",
    "branch": "CSE",
    "year": "1st Year",
    "phone": "7890123456",
    "email": "arjun.patel@example.com",
    "society": "Coding Club",
    "whyJoin": "Flux represents the perfect opportunity to apply theoretical knowledge in real-world scenarios while learning from industry experts.",
    "softSkills": ["Analytical Thinking", "Collaboration", "Attention to Detail", "Adaptability"],
    "hardSkills": ["C++", "Python", "Data Analysis", "Statistics"],
    "projectLink": "",
    "imageUrl": "https://res.cloudinary.com/dykj0kqay/image/upload/v1758905459/arjun.jpg",
    "githubProfile": "https://github.com/arjun-patel, https://www.codechef.com/users/arjun_codes",
    "residence": "Mumbai, Maharashtra",
    "createdAt": "2025-09-26T18:30:01.074+00:00",
    "updatedAt": "2025-09-26T18:30:01.074+00:00",
    "__v": 0
  }
];

interface AppState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  darkMode: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    candidates: [],
    loading: true,
    error: null,
    darkMode: false
  });

  // Simulate data fetching from MongoDB
  useEffect(() => {
    const fetchCandidates = async (): Promise<void> => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({
          ...prev,
          candidates: mockCandidates,
          loading: false
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to fetch candidates',
          loading: false
        }));
      }
    };

    fetchCandidates();
  }, []);

  // Dark mode toggle
  const toggleDarkMode = (): void => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    document.documentElement.classList.toggle('dark');
  };

  // Calculate dashboard statistics
  const stats = React.useMemo(() => {
    return {
      totalCandidates: state.candidates.length,
      branches: new Set(state.candidates.map(c => c.branch)).size,
      years: new Set(state.candidates.map(c => c.year)).size,
      withSociety: state.candidates.filter(c => c.society !== 'N/A').length
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
            <CandidateList 
              candidates={state.candidates} 
              loading={state.loading}
            />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
