import { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  products: [{ type: String, required: true }],
  date: { type: Date, required: true },
  status: { type: String, required: true },
  channel: { type: String, required: true },
});

const Orders = models.Orders || model("Orders", OrderSchema);

export default Orders;
