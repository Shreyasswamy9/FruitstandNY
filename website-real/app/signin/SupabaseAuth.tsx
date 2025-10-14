"use client";
import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabase-client';

const appearance = {
  theme: ThemeSupa,
  // override a few variables to get a dark look
  variables: {
    default: {
      colors: {
        brand: '#000000',
        brandAccent: '#ffffff',
        bodyBg: '#000000',
        defaultButtonBackground: '#000000',
        defaultButtonText: '#ffffff',
        inputBg: '#0b0b0b',
        inputBorder: '#222222',
        inputText: '#ffffff',
        textPrimary: '#ffffff'
      }
    }
  }
};

export default function SupabaseAuth() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background gradient + blurred color blobs matching contact page */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" />
      </div>

      <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-gray-300">
              Account access
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block">
              <h1 className="text-6xl font-extralight leading-tight mb-4">
                Welcome back
              </h1>
              <p className="text-gray-300 max-w-lg">
                Sign in to access your account, view orders, and manage your profile. Use Google or email/password to get started.
              </p>
            </div>

            <div>
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/10">
                <Auth
                  supabaseClient={supabase}
                  appearance={appearance}
                  providers={['google']}
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
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        /* Ensure Supabase Auth UI blends with the dark theme */
        .sbui-Auth { background: transparent !important; color: #fff !important; }
        .sbui-Card { background: rgba(255,255,255,0.03) !important; border-radius: 1rem !important; }
        .sbui-Input { background: rgba(255,255,255,0.02) !important; color: #fff !important; border: 1px solid rgba(255,255,255,0.06) !important; }
        /* Primary buttons: blue -> purple gradient like contact page */
        .sbui-Button, .sbui-Button-primary { background-image: linear-gradient(to right, #3b82f6, #8b5cf6) !important; color: #fff !important; border: none !important; }
        .sbui-Button:hover, .sbui-Button-primary:hover { filter: brightness(1.03); }
        .sbui-SocialButton { background: rgba(255,255,255,0.03) !important; color: #fff !important; }
        .sbui-ProviderButton { color: #fff !important; }

        @media (max-width: 640px) {
          .sbui-Card { padding: 1rem !important; border-radius: 12px !important; }
          .sbui-Auth { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
