import { Request, Response, NextFunction } from "express";
import Art from "../infrastructure/schemas/Art";
import { createArtDTO, updateArtDTO } from "../domain/dtos/art";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const getAllArts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const arts = await Art.find();
    res.status(200).json(arts);
    return;
  } catch (error) {
    next(error);
  }
};

export const createArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Zod validator 'createArtDTO' used.
    const createdArt = createArtDTO.safeParse(req.body);

    // Checking if the created art is in the shape of 'createArtDTO'
    if (!createdArt.success) {
      throw new ValidationError("Invalid art data");
    }

    // Create the art
    const art = await Art.create(createdArt.data);

    // Return the response
    res.status(201).json(art);
    return;
  } catch (error) {
    next(error);
  }
};

export const getArtById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;

    // Find the art by id
    const art = await Art.findById(artId);
    if (!art) {
      throw new NotFoundError("Art not found");
    }

    // Return the response
    res.status(200).json(art);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;

    // Zod validator 'updateProductDTO' used.
    const updatedArt = updateArtDTO.safeParse(req.body);

    // Checking if the updated art is in the shape of 'updateArtDTO'
    if (!updatedArt.success) {
      throw new ValidationError("Invalid art data");
    }

    // Update the art
    const art = await Art.findByIdAndUpdate(artId, updatedArt.data, {
      new: true,
    });

    // Return the response
    res.status(200).json(art);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;

    // Delete the art
    await Art.findByIdAndDelete(artId);

    // Return the response
    res.status(200).send("Art deleted successfully");
    return;
  } catch (error) {
    next(error);
  }
};
