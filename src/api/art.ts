import express from "express";
import {
  createArt,
  getAllArts,
  toggleLikeArt,
  incrementArtView,
  getAdminArts,
  banArt,
  unbanArt,
} from "../application/art";
import {
  createComment,
  deleteComment,
  getCommentsByArt,
} from "../application/comments";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const artsRouter = express.Router();

artsRouter.route("/").get(getAllArts).post(isAuthenticated, createArt);
artsRouter.post("/:id/like", isAuthenticated, toggleLikeArt);
artsRouter.post("/:id/view", incrementArtView);
artsRouter.route("/:id/comments").get(getCommentsByArt).post(createComment);
artsRouter
  .route("/:id/comments/:commentId")
  .delete(isAuthenticated, deleteComment);

// Admin endpoints
artsRouter.get("/admin", isAuthenticated, isAdmin, getAdminArts);
artsRouter.put("/admin/:id/ban", isAuthenticated, isAdmin, banArt);
artsRouter.put("/admin/:id/unban", isAuthenticated, isAdmin, unbanArt);

export default artsRouter;
