import React, { Suspense } from 'react';
import SupabaseAuth from '../signin/SupabaseAuth';

export const metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen" />}>
        <SupabaseAuth mode="sign_up" />
      </Suspense>
    </main>
  );
}
