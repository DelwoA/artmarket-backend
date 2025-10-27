import { Request, Response, NextFunction } from "express";
import Artist from "../infrastructure/schemas/Artist";
import Art from "../infrastructure/schemas/Art";
import { createArtistDTO, updateArtistDTO } from "../domain/dtos/artist";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { getAuth, clerkClient } from "@clerk/express";

export const getAllArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artists = await Artist.find({ status: "approved" });
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

    // Aggregate totals from arts by artistName to ensure accurate legacy totals
    const sums = await Art.aggregate([
      { $match: { artistName: (artist as any).name } },
      {
        $group: {
          _id: null,
          likesSum: { $sum: "$likes" },
          viewsSum: { $sum: "$views" },
        },
      },
    ]);
    const likesSum = Number(sums?.[0]?.likesSum ?? 0);
    const viewsSum = Number(sums?.[0]?.viewsSum ?? 0);

    // Persist backfilled totals if out of sync
    if (
      Number((artist as any).totalLikes ?? 0) !== likesSum ||
      Number((artist as any).totalViews ?? 0) !== viewsSum
    ) {
      await Artist.updateOne(
        { _id: (artist as any)._id },
        { $set: { totalLikes: likesSum, totalViews: viewsSum } }
      );
    }

    // Return the artist with accurate totals
    const out = {
      ...(artist.toObject ? artist.toObject() : (artist as any)),
      totalLikes: likesSum,
      totalViews: viewsSum,
    };
    res.status(200).json(out);
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

// Artist application by authenticated user
export const applyArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId;
    if (!userId) {
      throw new ValidationError("User not authenticated");
    }

    // Minimal validation of profile fields using createArtistDTO shape minus counters
    const parsed = createArtistDTO.safeParse({
      ...req.body,
      totalLikes: Number(req.body?.totalLikes ?? 0),
      totalViews: Number(req.body?.totalViews ?? 0),
    });
    if (!parsed.success) {
      throw new ValidationError("Invalid artist data");
    }

    const payload = parsed.data as any;

    // Check whether the user has already applied.
    const existing = await Artist.findOne({ clerkUserId: userId });

    if (existing) {
      // Update existing application details and reset status to pending.
      const updated = await Artist.findOneAndUpdate(
        { clerkUserId: userId },
        {
          ...payload,
          status: "pending",
          submittedAt: new Date(),
          $unset: { approvedAt: 1, rejectionReason: 1 },
        },
        { new: true }
      );

      res.status(200).json(updated);
      return;
    }

    // Create a new application. Use save() so the pre-save hook assigns artistId.
    const created = new Artist({
      ...payload,
      clerkUserId: userId,
      status: "pending",
      submittedAt: new Date(),
    });

    await created.save();

    res.status(200).json(created);
    return;
  } catch (error) {
    next(error);
  }
};

// Admin list artists by status
export const getAdminArtists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query as { status?: string };
    const filter: any = {};
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }
    const artists = await Artist.find(filter).sort({
      submittedAt: -1,
      approvedAt: -1,
    });
    res.status(200).json(artists);
    return;
  } catch (error) {
    next(error);
  }
};

export const approveArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const artist = await Artist.findByIdAndUpdate(
      id,
      {
        status: "approved",
        approvedAt: new Date(),
        $unset: { rejectionReason: 1 },
      },
      { new: true }
    );
    if (!artist) throw new NotFoundError("Artist not found");

    // Update Clerk role to artist
    if ((artist as any).clerkUserId) {
      await clerkClient.users.updateUser((artist as any).clerkUserId, {
        publicMetadata: { role: "artist" },
      });
    }

    res.status(200).json(artist);
    return;
  } catch (error) {
    next(error);
  }
};

export const rejectArtist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { reason } = req.body as { reason?: string };
    const artist = await Artist.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectionReason: reason,
        $unset: { approvedAt: 1 },
      },
      { new: true }
    );
    if (!artist) throw new NotFoundError("Artist not found");
    res.status(200).json(artist);
    return;
  } catch (error) {
    next(error);
  }
};
