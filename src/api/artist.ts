import express from "express";
import {
  createArtist,
  getAllArtists,
  applyArtist,
  getAdminArtists,
  approveArtist,
  rejectArtist,
} from "../application/artist";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const artistsRouter = express.Router();

// Public approved artists; legacy POST kept for internal/manual seeds if needed
artistsRouter.route("/").get(getAllArtists).post(createArtist);

// Artist application (authenticated user)
artistsRouter.route("/apply").post(isAuthenticated, applyArtist);

// Admin endpoints
artistsRouter.route("/admin").get(getAdminArtists);
artistsRouter.route("/admin/:id/approve").put(isAdmin, approveArtist);
artistsRouter.route("/admin/:id/reject").put(isAdmin, rejectArtist);

export default artistsRouter;
