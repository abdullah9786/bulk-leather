import mongoose, { Schema, Model } from "mongoose";

export interface IOrder {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    productImage: string;
    samplePrice?: number; // Sample price per unit
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: "cod" | "advance";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  totalItems: number;
  subtotal: number; // Subtotal before discount
  discount: number; // Discount amount
  totalAmount: number; // Final amount after discount
  notes?: string;
  advancePaymentLink?: string;
  specialOffer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
    },
    userEmail: {
      type: String,
      required: [true, "Email is required"],
    },
    userName: {
      type: String,
      required: [true, "Name is required"],
    },
    items: [{
      productId: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      productImage: {
        type: String,
        required: true,
      },
      samplePrice: {
        type: Number,
        min: 0,
        default: 0,
      },
    }],
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "advance"],
      required: true,
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalItems: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
    },
    advancePaymentLink: {
      type: String,
    },
    specialOffer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = 
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

