import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  images: string[];
  hoverImage?: string;
  inventory: {
    quantity: number;
    sizes?: Array<{
      size: string;
      quantity: number;
    }>;
    colors?: Array<{
      color: string;
      quantity: number;
    }>;
  };
  featured: boolean;
  active: boolean;
  tags: string[];
  specifications?: Record<string, string>;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    required: true
  }],
  hoverImage: {
    type: String
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    sizes: [{
      size: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [0, 'Size quantity cannot be negative']
      }
    }],
    colors: [{
      color: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [0, 'Color quantity cannot be negative']
      }
    }]
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  specifications: {
    type: Schema.Types.Mixed,
    default: {}
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes for better performance
ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ featured: 1, active: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ price: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
