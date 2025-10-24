import mongoose from "mongoose";
import Counter from "../counter.model";

const BlogSchema = new mongoose.Schema({
  blogId: {
    type: String,
    unique: true,
    index: true,
  },
  clerkUserId: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
    index: true,
  },
  rejectionReason: {
    type: String,
  },
  publishedAt: {
    type: Date,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
    maxlength: 160,
    trim: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

// PRE-SAVE HOOK → assign the next 4-digit blog ID automatically
// This is a pre-save hook that will be executed before the blog is saved to the database
BlogSchema.pre("save", async function (next) {
  // Skip if we already have a blogId (e.g. on updates)
  if (this.blogId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "blogId" }, // sequence key
      { $inc: { seq: 1 } }, // atomically increment
      { new: true, upsert: true }
    );

    // counter.seq will be 1, 2, 3, …
    // Format as 5-digit padded number: "00001", "00002", "00003"
    this.blogId = counter.seq.toString().padStart(5, "0");
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
