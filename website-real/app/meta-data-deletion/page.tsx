"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function MetaDataDeletionPage() {
  const policies = [
    { label: "Privacy Policy", link: "/privacy-policy" },
    { label: "Return Policy", link: "/return-policy" },
    { label: "Cookie Policy", link: "/cookie-policy" },
    { label: "Terms & Conditions", link: "/terms-and-conditions" },
    { label: "Meta Data Deletion", link: "/meta-data-deletion" }
  ];

  return (
    <div className="min-h-screen bg-[#fbf6f0]">
      {/* Policy Selector - Always Visible */}
      <div className="w-full max-w-2xl mx-auto pt-12 pb-4 px-4 sticky top-0 z-30 bg-[#fbf6f0]">
        <h1 className="text-[2rem] font-black uppercase tracking-[0.08em] text-[#1d1c19] mb-6 text-center font-avenir-black">Select a Policy</h1>
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {policies.map((policy) => (
            <Link href={policy.link} key={policy.label} className="rounded-lg border border-[#1d1c19]/15 bg-white shadow-sm hover:shadow-lg transition-shadow px-6 py-3 font-black uppercase tracking-[0.08em] text-[#1d1c19] hover:text-[#5227FF] font-avenir-black">
              {policy.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-50 border-b pt-20 sm:pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Meta Data Deletion Request
          </motion.h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-gray max-w-none"
        >
          <section className="mb-8 p-8 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-gray-700 leading-relaxed text-lg">
              If you have used Facebook (Meta) to log into FRUITSTAND and would like to request deletion of your data, you can do so by contacting us at:
            </p>
            
            <div className="mt-6 space-y-4 text-gray-700">
              <p className="font-semibold">
                Email: <a href="mailto:info@fruitstandny.com" className="text-blue-600 hover:text-blue-700">info@fruitstandny.com</a>
              </p>
              
              <div className="mt-6 pt-6 border-t border-blue-200">
                <p className="font-semibold mb-3">Please include in your request:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your name</li>
                  <li>The email associated with your Facebook account</li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-200">
                <p className="text-gray-700 leading-relaxed">
                  Once we receive your request, we will delete your data within a reasonable timeframe.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Information We Delete</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you request data deletion, we will remove all personal information associated with your Facebook/Meta login from our systems, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Your name and email address</li>
              <li>Profile information linked to your Facebook account</li>
              <li>Purchase history and order records</li>
              <li>Account preferences and settings</li>
              <li>Any other data collected through Facebook login</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Please note that we may retain certain data as required by law or for legitimate business purposes, such as accounting, auditing, and fraud prevention.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Deletion Timeline</h2>
            <p className="text-gray-700 leading-relaxed">
              We aim to process data deletion requests within 30 days of receipt. You will receive a confirmation email once your data has been deleted. If you have any questions about your data deletion request, please contact us at{" "}
              <a href="mailto:info@fruitstandny.com" className="text-blue-600 hover:text-blue-700">
                info@fruitstandny.com
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For more information about how we collect, use, and protect your data, please review our{" "}
              <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </Link>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you have additional questions or concerns about your privacy, please don't hesitate to contact us.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
