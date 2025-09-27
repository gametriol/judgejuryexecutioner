import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  // Only allow signing in via the provided invite buttons (no free-text input)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Select your name to sign in (no password). Only invited users can sign in.
          </p>

          <div className="flex flex-wrap gap-2">
            {ALLOWED_USERS.map((u) => (
              <Button key={u} size="sm" onClick={() => onSignIn(u)} className="truncate">
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
