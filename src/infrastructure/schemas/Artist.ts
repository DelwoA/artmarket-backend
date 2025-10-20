import mongoose from "mongoose";
import Counter from "../counter.model";

const ArtistSchema = new mongoose.Schema({
  artistId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
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
  totalLikes: {
    type: Number,
    default: 0,
  },
  totalViews: {
    type: Number,
    default: 0,
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
  featured: {
    type: Boolean,
    default: false,
  },
});

// PRE-SAVE HOOK → assign the next 4-digit artist ID automatically
// This is a pre-save hook that will be executed before the artist is saved to the database
ArtistSchema.pre("save", async function (next) {
  // Skip if we already have an artistId (e.g. on updates)
  if (this.artistId) return next();

  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "artistId" }, // sequence key
      { $inc: { seq: 1 } }, // atomically increment
      { new: true, upsert: true }
    );

    // counter.seq will be 1, 2, 3, …
    // Format as 5-digit padded number: "00001", "00002", "00003"
    this.artistId = counter.seq.toString().padStart(5, "0");
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(String(error)));
  }
});

const Artist = mongoose.model("Artist", ArtistSchema);
export default Artist;
