import express from "express";
import { createArt, getAllArts } from "../application/art";

const artsRouter = express.Router();

artsRouter.route("/").get(getAllArts).post(createArt);

export default artsRouter;
