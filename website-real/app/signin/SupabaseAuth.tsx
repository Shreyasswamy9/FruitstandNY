"use client";
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase-client';

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

export default function SupabaseAuth() {
  return (
  <div className="min-h-screen bg-[#fbf6f0] text-gray-900 overflow-hidden relative">
      {/* Subtle light decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white" />
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
                Secure Account Access
              </span>
              <h1 className="text-5xl md:text-6xl font-light leading-tight">
                Welcome <span className="font-semibold">back</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-md">
                Sign in to manage orders, track shipments, and personalize your {<>FRUITSTAND<sup>®</sup></>} experience. Choose Google, Apple, or classic email authentication.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-400" /> Order history & tracking</li>
                <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-400" /> Manage saved addresses</li>
                <li className="flex items-center gap-2"><span className="inline-block w-2 h-2 rounded-full bg-gray-400" /> Exclusive promotions</li>
              </ul>
            </div>

            {/* Auth card */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-gray-200 via-gray-100 to-white rounded-3xl blur-sm" aria-hidden="true" />
              <div className="relative bg-white rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.06)] border border-gray-200 p-6 md:p-10">
                <Auth
                  supabaseClient={supabase}
                  appearance={appearance}
                  providers={['google','apple']}
                  socialLayout="horizontal"
                  localization={{
                    variables: {
                      sign_in: {
                        email_label: 'Email',
                        password_label: 'Password'
                      }
                    }
                  }}
                />
                <p className="mt-6 text-xs text-gray-500 leading-relaxed">
                  By signing in you agree to our{' '}<a href="/terms-and-conditions" className="underline hover:text-gray-700">Terms</a>{' '}and{' '}<a href="/privacy-policy" className="underline hover:text-gray-700">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
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
