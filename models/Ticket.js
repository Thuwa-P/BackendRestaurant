const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Solved"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TicketSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "tickets",
  justOne: true,
});

module.exports = mongoose.model("Ticket", TicketSchema);
