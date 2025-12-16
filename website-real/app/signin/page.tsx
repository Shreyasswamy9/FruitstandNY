import React, { Suspense } from 'react';
import SupabaseAuth from './SupabaseAuth';

export const metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen" />}>
        <SupabaseAuth />
      </Suspense>
    </main>
  );
}
