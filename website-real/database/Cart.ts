import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId; // Product ID
  quantity: number;
  size?: string;
  color?: string;
  price: number; // Store price at time of adding to cart
}

export interface ICart extends Document {
  _id: string;
  user?: string; // User ID (optional for guest carts)
  sessionId?: string; // For guest users
  items: ICartItem[];
  totalAmount: number;
  expiresAt?: Date; // For guest carts
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  size: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  }
});

const CartSchema = new Schema<ICart>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true // Allows null values for guest carts
  },
  sessionId: {
    type: String,
    sparse: true // For guest users
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    index: { expireAfterSeconds: 0 } // TTL index for auto-deletion
  }
}, {
  timestamps: true
});

// Indexes
CartSchema.index({ user: 1 });
CartSchema.index({ sessionId: 1 });
CartSchema.index({ expiresAt: 1 });

// Pre-save middleware to calculate total amount
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  next();
});

const Cart: Model<ICart> = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

export default Cart;
