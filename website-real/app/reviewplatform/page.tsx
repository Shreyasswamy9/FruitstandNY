'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LogoButton from '@/components/LogoButton';
import Link from 'next/link';

const DISCOUNT_CODE = 'FRUITREVIEW10';
const TYPEFORM_ID = '01KMNRR2WF1FDQR920WTB9VGD1';

export default function ReviewPlatformPage() {
  const searchParams = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Load Typeform embed script
    const script = document.createElement('script');
    script.src = 'https://embed.typeform.com/next/embed.js';
    script.async = true;
    document.body.appendChild(script);

    setShowContent(true);

    // Check if returning from Typeform with submission
    const submitted = searchParams.get('submitted');
    if (submitted === 'true') {
      setIsSubmitted(true);
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [searchParams]);

  // Build Typeform URL with UTM parameters and return URL
  const utmSource = searchParams.get('utm_source') || '';
  const utmContent = searchParams.get('utm_content') || '';
  
  const typeformUrl = new URL(`https://form.typeform.com/to/${TYPEFORM_ID}`);
  
  // Add hidden fields if UTM parameters exist
  if (utmSource) typeformUrl.searchParams.append('utm_source', utmSource);
  if (utmContent) typeformUrl.searchParams.append('utm_content', utmContent);

  if (!showContent) {
    return null;
  }

  // If not submitted yet, show Typeform
  if (!isSubmitted) {
    return (
      <div className="w-full min-h-screen bg-white">
        <LogoButton />
        <div className="w-full h-screen flex items-center justify-center">
          <div data-tf-live={TYPEFORM_ID} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    );
  }

  // After submission, show thank you with discount code
  return (
    <div className="w-full min-h-screen bg-white">
      <LogoButton />
      <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-50 rounded-lg p-8 border border-green-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thank You!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Here's your code for $10 off your next purchase:
            </p>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 mb-8">
              <code className="text-3xl font-bold text-violet-600 tracking-wider">
                {DISCOUNT_CODE}
              </code>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              Apply this code at checkout to save $10 on your order.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
