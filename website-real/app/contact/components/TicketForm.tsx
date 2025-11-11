"use client"

import React from 'react'
import type { User } from '@supabase/supabase-js'
import FileAttachment from '@/components/FileAttachment'
import type { UploadResult } from '@/lib/storage'
import type { TicketFormData } from '../types'

interface Props {
  user: User | null
  formData: TicketFormData
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  submitMessage: string
  attachedFiles: UploadResult[]
  setAttachedFiles: React.Dispatch<React.SetStateAction<UploadResult[]>>
  onSignIn: () => void
  onSignUp: () => void
}

export default function TicketForm({
  user,
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  submitMessage,
  attachedFiles,
  setAttachedFiles,
  onSignIn,
  onSignUp,
}: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-gray-900 mb-4">Submit a Ticket</h2>
        <p className="text-gray-600 text-lg">Provide detailed information about your issue for faster resolution</p>

        {/* Authentication Notice */}
        {!user && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-center text-blue-700">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Authentication Required</span>
            </div>
            <p className="text-blue-600 text-sm mt-2">
              You must be signed in to submit a ticket.
              <button onClick={onSignIn} className="ml-1 underline hover:text-blue-800 font-medium">Sign in here</button>
              {" "}or{" "}
              <button onClick={onSignUp} className="underline hover:text-blue-800 font-medium">create an account</button>.
            </p>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              disabled={!user}
              className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all ${
                !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
              }`}
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              disabled={!user}
              className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all ${
                !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
              }`}
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            disabled={!user}
            className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all ${
              !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
            }`}
            placeholder="Optional phone number"
          />
        </div>

        {/* Issue Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={onInputChange}
            disabled={!user}
            className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all ${
              !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
            }`}
            required
          >
            <option value="" className="bg-white">Select issue category...</option>
            <option value="order-issue" className="bg-white">Order Issue</option>
            <option value="product-inquiry" className="bg-white">Product Inquiry</option>
            <option value="shipping" className="bg-white">Shipping & Delivery</option>
            <option value="return-refund" className="bg-white">Return & Refund</option>
            <option value="technical-issue" className="bg-white">Technical Issue</option>
            <option value="billing" className="bg-white">Billing & Payment</option>
            <option value="other" className="bg-white">Other</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">Priority will be set automatically based on the selected category.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Order ID (if applicable)</label>
            <input
              type="text"
              name="orderId"
              value={formData.orderId}
              onChange={onInputChange}
              disabled={!user}
              className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all ${
                !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
              }`}
              placeholder="Order ID or reference number"
            />
          </div>
          <div></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={onInputChange}
            disabled={!user}
            className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all ${
              !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
            }`}
            placeholder="Brief description of your issue"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            disabled={!user}
            rows={6}
            className={`w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all resize-none ${
              !user ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'
            }`}
            placeholder="Please provide as much detail as possible about your issue. Include steps to reproduce the problem, error messages, and any relevant information."
            required
          />
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Attachments</label>
          <div className={!user ? 'opacity-50 pointer-events-none' : ''}>
            <FileAttachment
              bucket="tickets"
              onFilesUploaded={(files) => setAttachedFiles(prev => [...prev, ...files])}
              onFilesRemoved={(index) => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
              maxFiles={5}
              userId={user?.id}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You can attach screenshots, documents, or other files to help us understand your issue better.
          </p>
          {attachedFiles.length > 0 && (
            <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
              {attachedFiles.map((f, i) => f.data && (
                <li key={i}>{f.data.path.split('/').pop()} ({Math.round(f.data.size/1024)} KB)</li>
              ))}
            </ul>
          )}
        </div>

        {submitMessage && (
          <div className={`p-4 rounded-xl ${submitMessage.includes('Error') ? 'bg-red-50 border border-red-300 text-red-700' : 'bg-green-50 border border-green-300 text-green-700'}`}>
            {submitMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !user}
          className={`w-full px-8 py-4 rounded-xl font-medium transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white ${
            !user
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : isSubmitting
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-[1.02]'
          }`}
        >
          {!user 
            ? 'Sign In Required' 
            : isSubmitting 
            ? 'Submitting...' 
            : 'Submit Ticket'
          }
        </button>
      </form>
    </div>
  )
}
