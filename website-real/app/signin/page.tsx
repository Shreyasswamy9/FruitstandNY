import React from 'react';
import SupabaseAuth from './SupabaseAuth';

export const metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return (
    <main>
      <SupabaseAuth />
    </main>
  );
}
