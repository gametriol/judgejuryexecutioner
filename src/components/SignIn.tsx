import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SignInProps {
  onSignIn: (username: string) => void;
}

// Canonical allowed usernames (shareable list is in allowed_users.txt at repo root)
const ALLOWED_USERS = [
  'Pradyumn',
  'Aman',
  'Priya',
  'Anant',
  'Aryan',
  'ShivamRai',
  'Ananya',
  'Anushka',
  'Ashish',
  'Riya',
  'ShivamMishra',
  'ShivamSingh',
  'ShubhamRai',
  'Vishesh',
  'Yashashvi',
  'Yashvardhan',
  'Aviral',
  'Tamanna',
];

const SignIn: React.FC<SignInProps> = ({ onSignIn }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  function attemptSignIn(raw: string) {
    const trimmed = raw?.trim();
    if (!trimmed) {
      setError('Please enter a username');
      return;
    }

    // Case-insensitive match, preserve canonical value
    const found = ALLOWED_USERS.find(u => u.toLowerCase() === trimmed.toLowerCase());
    if (!found) {
      setError('This username is not allowed. Check the invited list.');
      return;
    }

    setError(null);
    onSignIn(found);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Enter your username (no password). Only invited users may sign in.
          </p>

          <div className="mb-3">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your username"
              aria-label="username"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => attemptSignIn(value)}>Sign In</Button>
            <Button variant="ghost" onClick={() => { setValue(''); setError(null); }}>Clear</Button>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <hr className="my-4" />

          <p className="text-sm text-gray-500 mb-2">Invited users (case-insensitive):</p>
          <div className="flex flex-wrap gap-2">
            {ALLOWED_USERS.map(u => (
              <Button key={u} size="sm" onClick={() => attemptSignIn(u)} className="truncate">
                {u}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
