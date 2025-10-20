import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
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

const Blog = mongoose.model("Blog", BlogSchema);
export default Blog;
