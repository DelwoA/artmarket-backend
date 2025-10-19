import { Request, Response, NextFunction } from "express";
import Artist from "../infrastructure/schemas/Artist";
import { createArtistDTO, updateArtistDTO } from "../domain/dtos/artist";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

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
    if (!createdArtist.success) {
      throw new ValidationError("Invalid artist data");
    }

    // Create the artist
    const artist = await Artist.create(createdArtist.data);

    // Return the response
    res.status(201).json(artist);
    return;
  } catch (error) {
    next(error);
  }
};

export const getArtistById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artistId = req.params.id;

    // Find the artist by id
    const artist = await Artist.findById(artistId);
    if (!artist) {
      throw new NotFoundError("Artist not found");
    }

    // Return the response
    res.status(200).json(artist);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artistId = req.params.id;

    // Zod validator 'updateProductDTO' used.
    const updatedArtist = updateArtistDTO.safeParse(req.body);

    // Checking if the updated artist is in the shape of 'updateArtistDTO'
    if (!updatedArtist.success) {
      throw new ValidationError("Invalid artist data");
    }

    // Update the artist
    const artist = await Artist.findByIdAndUpdate(
      artistId,
      updatedArtist.data,
      { new: true }
    );

    // Return the response
    res.status(200).json(artist);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artistId = req.params.id;

    // Delete the artist
    await Artist.findByIdAndDelete(artistId);

    // Return the response
    res.status(200).send("Artist deleted successfully");
    return;
  } catch (error) {
    next(error);
  }
};
