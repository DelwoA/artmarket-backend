import mongoose from "mongoose";
import Counter from "../counter.model";

const ArtSchema = new mongoose.Schema({
  artId: {
    type: String,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Painting",
      "Sculpture",
      "Photography",
      "Mixed Media",
      "Digital Art",
      "Other",
    ],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: {
    type: [String],
    required: true,
    validate: {
      validator: (arr: unknown[]) =>
        Array.isArray(arr) && arr.length >= 1 && arr.length <= 5,
      message: "Images must contain between 1 and 5 items",
    },
  },
  availability: {
    type: String,
    enum: ["For Sale", "Not for Sale", "Sold"],
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

// PRE-SAVE HOOK → assign the next 4-digit art ID automatically
// This is a pre-save hook that will be executed before the art is saved to the database
ArtSchema.pre("save", async function (next) {
  // Skip if we already have an artId (e.g. on updates)
  if (this.artId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "artId" }, // sequence key
      { $inc: { seq: 1 } }, // atomically increment
      { new: true, upsert: true }
    );

    // counter.seq will be 1, 2, 3, …
    // Format as 5-digit padded number: "00001", "00002", "00003"
    this.artId = counter.seq.toString().padStart(5, "0");
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

const Art = mongoose.model("Art", ArtSchema);
export default Art;
