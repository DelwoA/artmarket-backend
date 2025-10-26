import { Request, Response, NextFunction } from "express";
import Art from "../infrastructure/schemas/Art";
import { createArtDTO, updateArtDTO } from "../domain/dtos/art";
import Artist from "../infrastructure/schemas/Artist";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { getAuth } from "@clerk/express";

export const getAllArts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { category } = req.query as { category?: string };
    const filter: Record<string, unknown> = { visible: true };

    if (typeof category === "string" && category.trim()) {
      // Validate against allowed categories to avoid invalid values
      const allowed = new Set([
        "Painting",
        "Sculpture",
        "Photography",
        "Mixed Media",
        "Digital Art",
        "Other",
      ]);
      if (allowed.has(category)) {
        filter.category = category;
      }
    }

    const arts = await Art.find(filter);
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

    // Derive artistName from authenticated approved artist
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) throw new ValidationError("User not authenticated");

    const artist = await Artist.findOne({
      clerkUserId: userId,
      status: "approved",
    });
    if (!artist)
      throw new ValidationError("Artist profile not found or not approved");

    // Create the art
    const art = await Art.create({
      ...createdArt.data,
      artistName: (artist as any).name,
      visible: true,
    });

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

export const toggleLikeArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;
    const auth = getAuth(req);
    const userId = auth?.userId;

    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    // First try to like (add if not present)
    const addResult = await Art.updateOne(
      { _id: artId, likedBy: { $ne: userId } },
      { $addToSet: { likedBy: userId }, $inc: { likes: 1 } }
    );

    if (!addResult.modifiedCount) {
      // If nothing added, try to unlike (remove if present)
      await Art.updateOne(
        { _id: artId, likedBy: userId },
        { $pull: { likedBy: userId }, $inc: { likes: -1 } }
      );
    }

    const updated = await Art.findById(artId);
    if (!updated) {
      throw new NotFoundError("Art not found");
    }

    const liked = Array.isArray((updated as any).likedBy)
      ? (updated as any).likedBy.includes(userId)
      : false;

    res.status(200).json({ likes: updated.likes ?? 0, liked });
    return;
  } catch (error) {
    next(error);
  }
};

export const incrementArtView = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;
    const updated = await Art.findByIdAndUpdate(
      artId,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!updated) {
      throw new NotFoundError("Art not found");
    }
    res.status(200).json({ views: Number(updated.views ?? 0) });
    return;
  } catch (error) {
    next(error);
  }
};

// Admin list arts, optional visible filter
export const getAdminArts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { visible } = req.query as { visible?: string };
    const filter: any = {};
    if (visible === "true") filter.visible = true;
    if (visible === "false") filter.visible = false;
    const arts = await Art.find(filter).sort({ _id: -1 });
    res.status(200).json(arts);
    return;
  } catch (error) {
    next(error);
  }
};

export const banArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const art = await Art.findByIdAndUpdate(
      id,
      { visible: false },
      { new: true }
    );
    if (!art) throw new NotFoundError("Art not found");
    res.status(200).json(art);
    return;
  } catch (error) {
    next(error);
  }
};

export const unbanArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const art = await Art.findByIdAndUpdate(
      id,
      { visible: true },
      { new: true }
    );
    if (!art) throw new NotFoundError("Art not found");
    res.status(200).json(art);
    return;
  } catch (error) {
    next(error);
  }
};
