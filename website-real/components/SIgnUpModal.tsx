"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../app/supabase-client';
import { useEffect, useState } from 'react';

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupModal({ isOpen, onClose }: SupabaseAuthModalProps) {
  //const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        onClose();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, onClose]);

  if (!isOpen || !mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10002,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            padding: '4px 8px',
            lineHeight: 1,
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 600,
          marginBottom: '24px',
          color: '#111',
          textAlign: 'center',
        }}>
          Join Fruitstand
        </h2>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#111',
                  brandAccent: '#333',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#f8f9fa',
                  defaultButtonBackgroundHover: '#e9ecef',
                  inputBackground: '#f8f9fa',
                  inputBorder: '#e0e0e0',
                  inputBorderHover: '#111',
                  inputBorderFocus: '#111',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '8px',
                  buttonBorderRadius: '8px',
                  inputBorderRadius: '8px',
                },
              },
            },
            style: {
              button: {
                fontWeight: '500',
                fontSize: '1rem',
                padding: '12px 16px',
              },
              input: {
                fontSize: '1rem',
                padding: '12px 16px',
              },
              label: {
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#111',
              },
              anchor: {
                color: '#111',
                fontWeight: '500',
              },
            },
          }}
          providers={['google', 'apple']}
          redirectTo={`${window.location.origin}/auth/callback`}
          view="sign_in"
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign In',
                link_text: "Don't have an account? Sign up",
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Sign Up',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
        />
      </div>
    </div>
  );
}