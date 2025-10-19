import express from "express";
import { createArtist, getAllArtists } from "../application/artist";

const artistsRouter = express.Router();

artistsRouter.route("/").get(getAllArtists).post(createArtist);

export default artistsRouter;
