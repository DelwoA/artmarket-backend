import mongoose from "mongoose";

const HomeConfigSchema = new mongoose.Schema(
  {
    featuredArtistIds: {
      type: [String],
      default: [],
    },
    featuredArtIds: {
      type: [String],
      default: [],
    },
    featuredBlogIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const HomeConfig = mongoose.model("HomeConfig", HomeConfigSchema);
export default HomeConfig;
