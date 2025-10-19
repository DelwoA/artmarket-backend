import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
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
});

const Artist = mongoose.model("Artist", ArtistSchema);
export default Artist;
