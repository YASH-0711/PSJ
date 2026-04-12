import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemName: { type: String },
    netWeight: { type: Number, default: 0 },
    grossWeight: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    purity: { type: String },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const psjInvoiceSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    customerAddress: { type: String },
    customerContact: { type: String },
    date: { type: String },
    oldPurchase: { type: Number, default: 0 },
    items: [itemSchema],
    subTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    mode: { type: String, default: "default" },
    metalType: { type: String },

  totalGold: { type: Number, default: 0 },
  totalSilver: { type: Number, default: 0 },

  cashPayment: { type: Number, default: 0 },
  onlinePayment: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Psj =
  mongoose.models.Psjbills  || mongoose.model("Psjbills", psjInvoiceSchema);

export default Psj;
