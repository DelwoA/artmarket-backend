import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "artistId", "artId", "blogId"
  seq: { type: Number, default: 0 }, // last value handed out
});

export default mongoose.model("Counter", CounterSchema);
