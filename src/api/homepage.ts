import express from "express";
import {
  getHomepageConfig,
  updateHomepageConfig,
} from "../application/homepage";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const HomepageRouter = express.Router();

HomepageRouter.route("/")
  .get(getHomepageConfig)
  .put(isAuthenticated, isAdmin, updateHomepageConfig);

export default HomepageRouter;
