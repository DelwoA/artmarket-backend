import mongoose from "mongoose";

const UserProfileSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      enum: [
        "Australia",
        "Canada",
        "China",
        "France",
        "Germany",
        "India",
        "Italy",
        "Japan",
        "New Zealand",
        "Qatar",
        "Russia",
        "Saudi Arabia",
        "South Korea",
        "Spain",
        "Sri Lanka",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
      ],
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    instagram: {
      type: String,
      required: true,
    },
    facebook: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);
export default UserProfile;
