import mongoose, { Document, Schema } from 'mongoose';

// Ticket Message Interface
export interface ITicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin' | 'system';
  message: string;
  attachments?: {
    filename: string;
    url: string;
    size: number;
    type: string;
  }[];
  timestamp: Date;
  isInternal?: boolean; // For admin-only notes
}

// Ticket Interface
export interface ITicket extends Document {
  ticketId: string;
  userId?: string; // Optional for guest users
  userEmail: string;
  userName: string;
  userPhone?: string;
  
  // Ticket Details
  subject: string;
  category: 'order-issue' | 'product-inquiry' | 'shipping' | 'return-refund' | 'technical-issue' | 'billing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed';
  
  // Content
  description: string;
  messages: ITicketMessage[];
  tags?: string[];
  
  // Assignment & Tracking
  assignedTo?: string; // Admin user ID
  assignedToName?: string;
  
  // Order Information (if applicable)
  orderId?: string;
  productId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastResponseAt?: Date;
  resolvedAt?: Date;
  satisfactionRating?: number; // 1-5 stars
  satisfactionFeedback?: string;
  
  // System
  isArchived: boolean;
  source: 'web' | 'email' | 'phone' | 'chat';
}

const TicketMessageSchema = new Schema<ITicketMessage>({
  id: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { 
    type: String, 
    enum: ['user', 'admin', 'system'], 
    required: true 
  },
  message: { type: String, required: true },
  attachments: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true }
  }],
  timestamp: { type: Date, default: Date.now },
  isInternal: { type: Boolean, default: false }
});

const TicketSchema = new Schema<ITicket>({
  ticketId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  userId: { 
    type: String, 
    index: true
  },
  userEmail: { 
    type: String, 
    required: true,
    index: true
  },
  userName: { type: String, required: true },
  userPhone: { type: String },
  
  // Ticket Details
  subject: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['order-issue', 'product-inquiry', 'shipping', 'return-refund', 'technical-issue', 'billing', 'other'],
    required: true,
    index: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'waiting-response', 'resolved', 'closed'],
    default: 'open',
    index: true
  },
  
  // Content
  description: { type: String, required: true },
  messages: [TicketMessageSchema],
  tags: [{ type: String }],
  
  // Assignment & Tracking
  assignedTo: { type: String, index: true },
  assignedToName: { type: String },
  
  // Order Information
  orderId: { type: String, index: true },
  productId: { type: String, index: true },
  
  // Metadata
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  lastResponseAt: { type: Date },
  resolvedAt: { type: Date },
  satisfactionRating: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  satisfactionFeedback: { type: String },
  
  // System
  isArchived: { type: Boolean, default: false, index: true },
  source: { 
    type: String, 
    enum: ['web', 'email', 'phone', 'chat'],
    default: 'web'
  }
}, {
  timestamps: true,
  collection: 'tickets'
});

// Indexes for performance
TicketSchema.index({ status: 1, priority: 1 });
TicketSchema.index({ userEmail: 1, status: 1 });
TicketSchema.index({ assignedTo: 1, status: 1 });
TicketSchema.index({ createdAt: -1 });
TicketSchema.index({ category: 1, status: 1 });

// Virtual for ticket age
TicketSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update timestamps
TicketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to generate ticket ID
TicketSchema.statics.generateTicketId = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TKT-${timestamp}-${random}`.toUpperCase();
};

// Instance method to add message
TicketSchema.methods.addMessage = function(
  senderId: string, 
  senderName: string, 
  senderRole: 'user' | 'admin' | 'system',
  message: string, 
  attachments?: any[],
  isInternal?: boolean
) {
  const messageId = new mongoose.Types.ObjectId().toString();
  this.messages.push({
    id: messageId,
    senderId,
    senderName,
    senderRole,
    message,
    attachments: attachments || [],
    timestamp: new Date(),
    isInternal: isInternal || false
  });
  this.lastResponseAt = new Date();
  return this.save();
};

// Instance method to update status
TicketSchema.methods.updateStatus = function(newStatus: string, updatedBy?: string) {
  this.status = newStatus;
  if (newStatus === 'resolved' || newStatus === 'closed') {
    this.resolvedAt = new Date();
  }
  return this.save();
};

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);