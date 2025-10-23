import express from "express";
import { createArt, getAllArts, toggleLikeArt } from "../application/art";
import { isAuthenticated } from "./middleware/authentication-middleware";

const artsRouter = express.Router();

artsRouter.route("/").get(getAllArts).post(createArt);
artsRouter.post("/:id/like", isAuthenticated, toggleLikeArt);

export default artsRouter;
