import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    artId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Art",
      required: true,
      index: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    authorUsername: {
      type: String,
      required: true,
      trim: true,
    },
    authorDisplayName: {
      type: String,
      required: true,
      trim: true,
    },
    authorImage: {
      type: String,
      required: true,
    },
    authorRole: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ artId: 1, createdAt: -1 });

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
