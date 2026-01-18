import mongoose from "mongoose";

const UserQuoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 🔑 one quote per user
      index: true,
    },

    quote: {
      type: String,
      required: true,
      trim: true,
    },

    lastUpdated: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("UserQuote", UserQuoteSchema);
