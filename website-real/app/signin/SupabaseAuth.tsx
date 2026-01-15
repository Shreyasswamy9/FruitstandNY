"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase-client';
import { usePasswordVisibilityToggle } from '@/hooks/usePasswordVisibilityToggle';
import { useRouter, useSearchParams } from 'next/navigation';

const appearance = {
  theme: ThemeSupa,
  // Light / white theme overrides
  variables: {
    default: {
      colors: {
        brand: '#111111',
        brandAccent: '#ff6b6b',
        bodyBg: '#ffffff',
        defaultButtonBackground: '#111111',
        defaultButtonText: '#ffffff',
        inputBg: '#ffffff',
        inputBorder: '#d1d5db',
        inputText: '#111111',
        textPrimary: '#111111'
      }
    }
  }
};

type AuthMode = 'sign_in' | 'sign_up';

interface SupabaseAuthProps {
  mode?: AuthMode;
}

export default function SupabaseAuth({ mode = 'sign_in' }: SupabaseAuthProps) {
  usePasswordVisibilityToggle();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);
  const isSignUp = mode === 'sign_up';

  const rawRedirect = searchParams?.get('redirect') ?? null;
  const authCode = searchParams?.get('code') ?? null;

  const safeRedirect = useMemo(() => {
    if (!rawRedirect) return '/account';
    if (/^https?:\/\//i.test(rawRedirect)) return '/account';
    return rawRedirect.startsWith('/') ? rawRedirect : `/${rawRedirect}`;
  }, [rawRedirect]);

  useEffect(() => {
    if (!authCode) return;

    const finalizeOAuth = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(authCode);
      if (error) {
        console.error('Supabase OAuth exchange failed:', error);
      }
    };

    finalizeOAuth();
  }, [authCode]);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted || !session) return;
      router.replace(safeRedirect);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.replace(safeRedirect);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router, safeRedirect]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const origin = window.location.origin;
    const basePath = mode === 'sign_up' ? '/signup' : '/signin';
    const signinUrl = new URL(basePath, origin);
    if (safeRedirect) {
      signinUrl.searchParams.set('redirect', safeRedirect);
    }
    setRedirectTo(signinUrl.toString());
  }, [mode, safeRedirect]);

  const oppositeAuthHref = useMemo(() => {
    const base = isSignUp ? '/signin' : '/signup';
    if (!safeRedirect) return base;
    const params = new URLSearchParams({ redirect: safeRedirect });
    return `${base}?${params.toString()}`;
  }, [isSignUp, safeRedirect]);

  const copy = useMemo(() => {
    if (isSignUp) {
      return {
        badge: 'Join FRUITSTAND®',
        heading: (
          <>
            Create your
            {' '}
            <span className="font-semibold">account</span>
          </>
        ),
        description:
          'Unlock drops, track orders, and personalize your FRUITSTAND experience with a single login.',
        bullets: [
          'Access new releases before anyone else',
          'Save your favorite fits for later',
          'Faster checkout and order tracking'
        ],
      };
    }

    return {
      badge: 'Secure Account Access',
      heading: (
        <>
          Welcome <span className="font-semibold">back</span>
        </>
      ),
      description:
        'Sign in to manage orders, track shipments, and personalize your FRUITSTAND® experience.',
      bullets: [
        'Order history & tracking',
        'Manage saved addresses',
        'Exclusive promotions'
      ],
    };
  }, [isSignUp]);

  return (
  <div className="min-h-screen bg-[#fbf6f0] text-gray-900 overflow-hidden relative">
      {/* Subtle light decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-white via-white to-white" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="relative w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left branding / intro */}
            <div className="space-y-6">
              <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium tracking-wide shadow-sm">
                {copy.badge}
              </span>
              <h1 className="text-5xl md:text-6xl font-light leading-tight">
                {copy.heading}
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                {copy.description}
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                {copy.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-tr from-gray-200 via-gray-100 to-white rounded-3xl blur-sm" aria-hidden="true" />
              <div className="relative bg-white rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] border border-gray-200 p-6 md:p-10">
                <Auth
                  supabaseClient={supabase}
                  appearance={appearance}
                  providers={['google','apple']}
                  socialLayout="horizontal"
                  redirectTo={redirectTo}
                  showLinks={false}
                  view={mode}
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Email',
                        password_label: 'Password'
                      },
                      sign_up: {
                        email_label: 'Email',
                        password_label: 'Password',
                        button_label: 'Create account'
                      }
                    }
                  }}
                />
                <p className="mt-4 text-sm text-gray-600 text-center">
                  {isSignUp ? (
                    <>
                      Already have an account?{' '}
                      <Link href={oppositeAuthHref} className="font-semibold text-black underline-offset-2 hover:underline">
                        Sign in
                      </Link>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{' '}
                      <Link href={oppositeAuthHref} className="font-semibold text-black underline-offset-2 hover:underline">
                        Sign up
                      </Link>
                    </>
                  )}
                </p>
                <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                  By continuing you agree to our{' '}<a href="/terms-and-conditions" className="underline hover:text-gray-700">Terms</a>{' '}and{' '}<a href="/privacy-policy" className="underline hover:text-gray-700">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .fs-password-toggle {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: #4b5563;
        }
        .fs-password-toggle:focus-visible {
          outline: 2px solid #111;
          outline-offset: 2px;
        }
        /* Supabase Auth light theme refinement */
        .sbui-Auth { background: transparent !important; color: #111 !important; }
        .sbui-Card { background: #ffffff !important; border: 1px solid #e5e7eb !important; border-radius: 1rem !important; box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important; }
        .sbui-Input { background: #ffffff !important; color: #111 !important; border: 1px solid #d1d5db !important; border-radius: 10px !important; }
        .sbui-Input:focus-within { box-shadow: 0 0 0 2px #111 inset !important; }
        .sbui-Button, .sbui-Button-primary { background: #111 !important; color: #fff !important; border-radius: 10px !important; font-weight: 600 !important; transition: background .2s ease, transform .2s ease !important; }
        .sbui-Button:hover, .sbui-Button-primary:hover { background: #222 !important; transform: translateY(-1px); }
        .sbui-SocialButton, .sbui-ProviderButton { background: #f5f5f5 !important; color: #111 !important; border: 1px solid #e5e7eb !important; border-radius: 10px !important; transition: background .2s ease, border-color .2s ease !important; }
        .sbui-SocialButton:hover, .sbui-ProviderButton:hover { background: #ececec !important; border-color: #d1d5db !important; }
        .sbui-Checkbox input:focus { outline: 2px solid #111 !important; }
        .sbui-Alert { border-radius: 10px !important; }

        /* Ensure text contrast */
        .sbui-Label, .sbui-Typography-text, .sbui-Typography-caption { color: #111 !important; }

        @media (max-width: 640px) {
          .sbui-Card { padding: 1rem !important; }
          .sbui-Auth { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
