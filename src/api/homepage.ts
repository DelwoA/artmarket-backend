import express from "express";
import {
  getHomepageConfig,
  updateHomepageConfig,
} from "../application/homepage";

const HomepageRouter = express.Router();

HomepageRouter.route("/").get(getHomepageConfig).put(updateHomepageConfig);

export default HomepageRouter;
