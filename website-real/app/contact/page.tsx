"use client"

import { useState, useEffect } from "react"
import { supabase } from "../supabase-client"
import StaggeredMenu from "../../components/StagerredMenu"
import FileAttachment from "../../components/FileAttachment"
import { UploadResult } from "@/lib/storage"

interface TicketFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  orderId: string;
  productId: string;
}

interface UserTicket {
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: any[];
}

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [userTickets, setUserTickets] = useState<UserTicket[]>([])
  const [trackingEmail, setTrackingEmail] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [user, setUser] = useState<any | null>(null)
  const [userSession, setUserSession] = useState<any | null>(null)
  const [attachedFiles, setAttachedFiles] = useState<UploadResult[]>([])

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getCurrentUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setUserSession(session)
    })

    return () => {
      listener?.subscription?.unsubscribe()
    }
  }, [])

  const [formData, setFormData] = useState<TicketFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    priority: 'medium',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Prepare attachments data
      const attachments = attachedFiles
        .filter(file => file.success && file.data)
        .map(file => ({
          filename: file.data!.path.split('/').pop() || 'unknown',
          url: file.data!.publicUrl,
          size: file.data!.size,
          type: file.data!.type
        }));

      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { 'Authorization': `Bearer ${userSession?.access_token}` })
        },
        body: JSON.stringify({
          userName: formData.name,
          userEmail: formData.email,
          userPhone: formData.phone,
          subject: formData.subject,
          category: formData.category,
          priority: formData.priority,
          description: formData.description,
          orderId: formData.orderId || undefined,
          productId: formData.productId || undefined,
          attachments
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitMessage(`Ticket created successfully! Your ticket ID is: ${data.ticket.ticketId}`)
        setFormData({
          name: user?.user_metadata?.name || user?.email?.split('@')[0] || '',
          email: user?.email || '',
          phone: '',
          subject: '',
          category: '',
          priority: 'medium',
          description: '',
          orderId: '',
          productId: ''
        })
        setAttachedFiles([])
        // Switch to tracking tab to show the new ticket
        setActiveTab('track')
        fetchUserTickets()
      } else {
        setSubmitMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setSubmitMessage('Failed to submit ticket. Please try again.')
      console.error('Error submitting ticket:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchUserTickets = async () => {
    const email = user?.email || trackingEmail
    if (!email) return

    try {
      const response = await fetch(`/api/tickets?email=${encodeURIComponent(email)}`, {
        headers: {
          ...(user && { 'Authorization': `Bearer ${userSession?.access_token}` })
        }
      })

      const data = await response.json()
      if (response.ok) {
        setUserTickets(data.tickets || [])
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }

  const handleTrackTickets = () => {
    if (trackingEmail || user?.email) {
      fetchUserTickets()
    }
  }

  const addMessageToTicket = async (ticketId: string) => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && { 'Authorization': `Bearer ${userSession?.access_token}` })
        },
        body: JSON.stringify({
          message: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchUserTickets()
        // Refresh selected ticket details
        if (selectedTicket) {
          const updatedTicket = userTickets.find(t => t.ticketId === ticketId)
          if (updatedTicket) setSelectedTicket(updatedTicket)
        }
      }
    } catch (error) {
      console.error('Error adding message:', error)
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
              Support Ticket
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            Get organized support through our ticket system. Submit your issue, track progress, and communicate directly with our support team.
          </p>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === 'submit'
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Submit Ticket
            </button>
            <button
              onClick={() => setActiveTab('track')}
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
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-gray-900 mb-4">Submit a Support Ticket</h2>
                <p className="text-gray-600 text-lg">Provide detailed information about your issue for faster resolution</p>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="Optional phone number"
                  />
                </div>

                {/* Issue Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Priority Level</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                    >
                      <option value="low" className="bg-white">Low - General Question</option>
                      <option value="medium" className="bg-white">Medium - Standard Issue</option>
                      <option value="high" className="bg-white">High - Urgent Issue</option>
                      <option value="urgent" className="bg-white">Urgent - Critical Problem</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Order ID (if applicable)</label>
                    <input
                      type="text"
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
                      placeholder="Order ID or reference number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all resize-none"
                    placeholder="Please provide as much detail as possible about your issue. Include steps to reproduce the problem, error messages, and any relevant information."
                    required
                  />
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Attachments</label>
                  <FileAttachment
                    bucket="tickets"
                    onFilesUploaded={(files) => setAttachedFiles(prev => [...prev, ...files])}
                    onFilesRemoved={(index) => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                    maxFiles={5}
                    userId={user?.id}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    You can attach screenshots, documents, or other files to help us understand your issue better.
                  </p>
                </div>

                {submitMessage && (
                  <div className={`p-4 rounded-xl ${submitMessage.includes('Error') ? 'bg-red-50 border border-red-300 text-red-700' : 'bg-green-50 border border-green-300 text-green-700'}`}>
                    {submitMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </form>
            </div>
          )}

          {/* Track Tickets Tab */}
          {activeTab === 'track' && (
            <div className="space-y-8">
              {/* Email Input for Guests */}
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

              {/* Tickets List */}
              {userTickets.length > 0 ? (
                <div className="grid gap-6">
                  {userTickets.map((ticket) => (
                    <div key={ticket.ticketId} className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-300">
                      <div className="flex flex-wrap items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900 mb-2">{ticket.subject}</h3>
                          <p className="text-gray-600 text-sm">Ticket ID: {ticket.ticketId}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)} border border-current`}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)} border border-current`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <p className="text-gray-900">{ticket.category.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <p className="text-gray-900">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Messages:</span>
                          <p className="text-gray-900">{ticket.messages.length}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTicket(selectedTicket?.ticketId === ticket.ticketId ? null : ticket)}
                        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors"
                      >
                        {selectedTicket?.ticketId === ticket.ticketId ? 'Hide Details' : 'View Details'}
                      </button>

                      {/* Ticket Details */}
                      {selectedTicket?.ticketId === ticket.ticketId && (
                        <div className="mt-6 pt-6 border-t border-gray-300">
                          <div className="space-y-4 mb-6">
                            {ticket.messages.map((message, index) => (
                              <div key={index} className={`p-4 rounded-lg ${message.senderRole === 'user' ? 'bg-blue-50 ml-8 border border-blue-200' : 'bg-gray-50 mr-8 border border-gray-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium text-gray-900">{message.senderName}</span>
                                  <span className="text-sm text-gray-600">{new Date(message.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-800">{message.message}</p>
                              </div>
                            ))}
                          </div>

                          {/* Add New Message */}
                          {ticket.status !== 'closed' && (
                            <div className="space-y-4">
                              <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 resize-none"
                                placeholder="Add a message to this ticket..."
                              />
                              <button
                                onClick={() => addMessageToTicket(ticket.ticketId)}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                              >
                                Send Message
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                question: "How do I submit a support ticket?",
                answer: "Use the 'Submit Ticket' tab above to create a new support request. Provide detailed information about your issue for faster resolution."
              },
              {
                question: "How can I track my support tickets?",
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

      {/* StaggeredMenu Component */}
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 10001, pointerEvents: menuOpen ? "auto" : "none" }}>
        <StaggeredMenu
          position="right"
          colors={['#18191a', '#232324']}
          className="custom-staggered-menu"
          items={[
            { label: "Home", ariaLabel: "Go to homepage", link: "/" },
            { label: "Shop", ariaLabel: "Browse our shop", link: "/shop" },
            { label: "Account", ariaLabel: "Access your account", link: "/account" },
            { label: "Cart", ariaLabel: "View your cart", link: "/cart" }
          ]}
          socialItems={[
            { label: "Instagram", link: "https://instagram.com" },
            { label: "Twitter", link: "https://twitter.com" }
          ]}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/images/newlogo.png"
          menuButtonColor="#ffffff"
          openMenuButtonColor="#000000"
          changeMenuColorOnOpen={true}
          accentColor="#ff6b6b"
          onMenuOpen={() => {setMenuOpen(true)}}
          onMenuClose={() => setMenuOpen(false)}
        />
      </div>

      {/* Custom styles for StaggeredMenu visibility */}
      <style jsx global>{`
        /* Ensure menu button header is always clickable */
        .custom-staggered-menu .staggered-menu-header {
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10003 !important;
        }

        /* Let the StaggeredMenu component handle color changes naturally */
        .custom-staggered-menu .staggered-menu-button {
          /* Allow dynamic color changes */
        }

        .custom-staggered-menu .staggered-menu-button span {
          /* Allow dynamic color changes */
        }

        /* Animation delays for background elements */
        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
