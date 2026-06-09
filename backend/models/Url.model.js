import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: [true, "Original URL is required"],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "",
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    lastVisited: {
      type: Date,
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual for full short URL ────────────────────────────────────────────────
urlSchema.virtual("shortUrl").get(function () {
  return `${process.env.BASE_URL}/${this.shortCode}`;
});

// Enable virtuals in JSON output
urlSchema.set("toJSON", { virtuals: true });
urlSchema.set("toObject", { virtuals: true });

const Url = mongoose.model("Url", urlSchema);
export default Url;
