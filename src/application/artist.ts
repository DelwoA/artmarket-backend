import { Request, Response, NextFunction } from "express";
import Artist from "../infrastructure/schemas/Artist";
import { createArtistDTO, updateArtistDTO } from "../domain/dtos/artist";

export const getAllArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artists = await Artist.find();
    res.status(200).json(artists);
    return;
  } catch (error) {
    next(error);
  }
};

export const createArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Zod validator 'createArtistDTO' used.
    const createdArtist = createArtistDTO.safeParse(req.body);

    // Checking if the created artist is in the shape of 'createArtistDTO'
    //   if (!createdProduct.success) {
    //     throw new ValidationError("Invalid product data");
    //   }

    // Create the artist
    const artist = await Artist.create(createdArtist.data);

    // Return the response
    res.status(201).json(artist);
    return;
  } catch (error) {
    next(error);
  }
};
