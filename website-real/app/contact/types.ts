// Central ticket-related types

export interface TicketFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  description: string;
  orderId: string;
  productId: string;
}

export interface TicketMessage {
  id: string;
  message: string;
  sender: 'user' | 'support';
  timestamp: string;
}

export interface TicketAttachmentMeta {
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface UserTicket {
  ticketId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export type SubmitTicketPayload = {
  userName: string;
  userEmail: string;
  userPhone: string;
  subject: string;
  category: string;
  description: string;
  orderId?: string;
  productId?: string;
  attachments: TicketAttachmentMeta[];
}
