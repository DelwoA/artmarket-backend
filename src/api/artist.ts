import express from "express";
import { getAllArtists } from "../application/artist";

const artistsRouter = express.Router();

artistsRouter.route("/").get(getAllArtists);

export default artistsRouter;
