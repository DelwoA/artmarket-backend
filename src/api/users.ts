import express from "express";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { getMe, upsertMe } from "../application/user";

const usersRouter = express.Router();

usersRouter
  .route("/me")
  .get(isAuthenticated, getMe)
  .put(isAuthenticated, upsertMe);

export default usersRouter;
