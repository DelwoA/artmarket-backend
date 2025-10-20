import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema({
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
  featured: {
    type: Boolean,
    default: false,
  },
});

const Art = mongoose.model("Art", ArtSchema);
export default Art;
