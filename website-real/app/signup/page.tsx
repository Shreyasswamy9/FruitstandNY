import React from 'react';
import SupabaseAuth from '../signin/SupabaseAuth';

export const metadata = {
  title: 'Sign up',
};

export default function SignUpPage() {
  return (
    <main>
      <SupabaseAuth />
    </main>
  );
}
