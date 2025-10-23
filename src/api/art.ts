import express from "express";
import { createArt, getAllArts, toggleLikeArt } from "../application/art";
import {
  createComment,
  deleteComment,
  getCommentsByArt,
} from "../application/comments";
import { isAuthenticated } from "./middleware/authentication-middleware";

const artsRouter = express.Router();

artsRouter.route("/").get(getAllArts).post(createArt);
artsRouter.post("/:id/like", isAuthenticated, toggleLikeArt);
artsRouter.route("/:id/comments").get(getCommentsByArt).post(createComment);
artsRouter
  .route("/:id/comments/:commentId")
  .delete(isAuthenticated, deleteComment);

export default artsRouter;
