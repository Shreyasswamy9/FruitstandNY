'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import LogoButton from '@/components/LogoButton';
import Link from 'next/link';

const DISCOUNT_CODE = 'FRUITREVIEW10';
const TYPEFORM_ID = 'ILjnsvqB';

export default function ReviewPlatformPage() {
  const searchParams = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Load Typeform embed script
    const script = document.createElement('script');
    script.src = 'https://embed.typeform.com/embed.js';
    script.async = true;
    
    script.onload = () => {
      // Redraw embedded forms after script loads
      if (window.tf) {
        window.tf.redraw();
      }
    };
    
    document.body.appendChild(script);

    // Listen for form submission via postMessage
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'form.submitted') {
        setIsSubmitted(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Build Typeform URL with UTM parameters
  const utmSource = searchParams.get('utm_source') || '';
  const utmContent = searchParams.get('utm_content') || '';
  
  const typeformUrl = new URL(`https://form.typeform.com/to/${TYPEFORM_ID}`);
  
  // Add hidden fields if UTM parameters exist
  if (utmSource) typeformUrl.searchParams.append('utm_source', utmSource);
  if (utmContent) typeformUrl.searchParams.append('utm_content', utmContent);

  return (
    <div className="w-full min-h-screen bg-white">
      <LogoButton />
      
      {!isSubmitted ? (
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            <div 
              data-tf-live={typeformUrl.toString()}
              style={{ width: '100%', height: '600px' }}
            />
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}
