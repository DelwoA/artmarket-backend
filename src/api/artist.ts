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
artistsRouter.post("/apply", isAuthenticated, applyArtist);

// Admin endpoints
artistsRouter.get("/admin", isAuthenticated, isAdmin, getAdminArtists);
artistsRouter.put(
  "/admin/:id/approve",
  isAuthenticated,
  isAdmin,
  approveArtist
);
artistsRouter.put("/admin/:id/reject", isAuthenticated, isAdmin, rejectArtist);

export default artistsRouter;
