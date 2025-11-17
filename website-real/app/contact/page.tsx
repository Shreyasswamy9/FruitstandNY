"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuthUser } from "./hooks/useAuthUser"
import { useTickets } from "./hooks/useTickets"
import TicketForm from "./components/TicketForm"
import TicketList from "./components/TicketList"
import type { TicketFormData } from "./types"
import type { UploadResult } from "@/lib/storage"

export default function ContactPage() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit')
  const [submitMessage, setSubmitMessage] = useState('')
  const [trackingEmail, setTrackingEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<UploadResult[]>([])
  const { user, session: userSession } = useAuthUser()
  const { tickets: userTickets, fetchTickets, submitTicket, addMessage } = useTickets({ user, session: userSession })

  // Refs to scroll into view for each section
  const submitRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [pendingScroll, setPendingScroll] = useState<"submit" | "track" | null>(null)

  const [formData, setFormData] = useState<TicketFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    description: '',
    orderId: '',
    productId: ''
  })

  // Pre-populate form with user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        email: user.email || '',
      }))
      setTrackingEmail(user.email || '')
    }
  }, [user])

  // When a tab is activated via hero buttons, smooth scroll to the section
  useEffect(() => {
    if (!pendingScroll) return
    if (pendingScroll !== activeTab) return
    const el = pendingScroll === 'submit' ? submitRef.current : trackRef.current
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Optional: focus for accessibility after a brief delay
      // setTimeout(() => el.focus?.(), 350)
      setPendingScroll(null)
    }
  }, [activeTab, pendingScroll])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTrackTickets = () => {
    if (trackingEmail || user?.email) {
      fetchTickets(trackingEmail)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-400'
      case 'in-progress': return 'text-yellow-400'
      case 'waiting-response': return 'text-orange-400'
      case 'resolved': return 'text-green-400'
      case 'closed': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'urgent': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-gray-100 backdrop-blur-sm rounded-full text-sm font-medium text-gray-600 mb-6">
              Professional Support System
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extralight tracking-wider mb-8 text-gray-900 leading-tight">
            Submit a<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
              Ticket
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            Get organized support through our ticket system. Submit your issue, track progress, and communicate directly with our support team.
          </p>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => { setActiveTab('submit'); setPendingScroll('submit') }}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'submit'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Submit Ticket
            </button>
            <button
              onClick={() => { setActiveTab('track'); setPendingScroll('track') }}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'track'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Track Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Ticket System Content */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Submit Ticket Tab */}
          {activeTab === 'submit' && (
            <div ref={submitRef} id="submit-ticket-section" className="scroll-mt-24 outline-none" tabIndex={-1}>
            <TicketForm
              user={user}
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={async (e) => {
                e.preventDefault()
                if (!user) {
                  setSubmitMessage('Please sign in to submit a ticket.')
                  setTimeout(() => router.push('/auth/signin'), 2000)
                  return
                }
                setIsSubmitting(true)
                setSubmitMessage('')
                // prepare payload from uploaded files
                const attachments = attachedFiles
                  .filter(file => file.success && file.data)
                  .map(file => ({
                    filename: file.data!.path.split('/').pop() || 'unknown',
                    url: file.data!.publicUrl,
                    size: file.data!.size,
                    type: file.data!.type
                  }))

                const result = await submitTicket({
                  userName: formData.name,
                  userEmail: formData.email,
                  userPhone: formData.phone,
                  subject: formData.subject,
                  category: formData.category,
                  description: formData.description,
                  orderId: formData.orderId || undefined,
                  productId: formData.productId || undefined,
                  attachments
                })
                if (result.success) {
                  const ticketId = result.data.ticket.ticketId
                  setSubmitMessage(`Ticket created successfully! Your ticket ID is: ${ticketId}`)
                  setFormData({
                    name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
                    email: user?.email || '',
                    phone: '',
                    subject: '',
                    category: '',
                    description: '',
                    orderId: '',
                    productId: ''
                  })
                  setAttachedFiles([])
                  setActiveTab('track')
                  fetchTickets()
                } else {
                  setSubmitMessage(`Error: ${result.error}`)
                }
                setIsSubmitting(false)
              }}
              isSubmitting={isSubmitting}
              submitMessage={submitMessage}
              attachedFiles={attachedFiles}
              setAttachedFiles={setAttachedFiles}
              onSignIn={() => router.push('/auth/signin')}
              onSignUp={() => router.push('/auth/signup')}
            />
            </div>
          )}

          {/* Track Tickets Tab */}
          {activeTab === 'track' && (
            <div ref={trackRef} id="track-ticket-section" className="space-y-8 scroll-mt-24 outline-none" tabIndex={-1}>
              {!user && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-300 max-w-2xl mx-auto">
                  <h3 className="text-xl font-medium text-gray-900 mb-4 text-center">Track Your Tickets</h3>
                  <div className="flex gap-4">
                    <input
                      type="email"
                      value={trackingEmail}
                      onChange={(e) => setTrackingEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email address"
                    />
                    <button
                      onClick={handleTrackTickets}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
                    >
                      Track
                    </button>
                  </div>
                </div>
              )}
              {userTickets.length > 0 ? (
                <TicketList
                  tickets={userTickets}
                  onAddMessage={(id, msg) => addMessage(id, msg)}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No tickets found</p>
                  {trackingEmail && (
                    <p className="text-gray-500 text-sm mt-2">Try submitting a ticket first or check your email address</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-white text-center mb-16">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How do I submit a ticket?",
                answer: "Use the 'Submit Ticket' tab above to create a new support request. Provide detailed information about your issue for faster resolution."
              },
              {
                question: "How can I track my tickets?",
                answer: "Use the 'Track Tickets' tab with your email address to view all your submitted tickets and their current status."
              },
              {
                question: "What's your response time for tickets?",
                answer: "We typically respond within 24 hours for standard issues, and within 4 hours for urgent matters during business hours."
              },
              {
                question: "Can I add messages to an existing ticket?",
                answer: "Yes! View your ticket details and use the message area to add updates or additional information to any open ticket."
              },
              {
                question: "What information should I include in my ticket?",
                answer: "Include your order ID (if applicable), detailed description of the issue, steps to reproduce the problem, and any error messages you've encountered."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-300">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Contact Info */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-red-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-light text-gray-900 mb-4">Need Immediate Assistance?</h3>
          <p className="text-gray-700 mb-6">For urgent issues that require immediate attention, please contact us directly:</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:urgent@fruitstand.com" className="flex items-center gap-2 px-6 py-3 bg-red-100 border border-red-300 text-red-700 rounded-xl hover:bg-red-200 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              urgent@fruitstand.com
            </a>
            <a href="tel:+15551234567" className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +1 (555) 123-4567
            </a>
          </div>
        </div>
      </div>

      
    </div>
  )
}
