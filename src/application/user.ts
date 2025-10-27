import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import UserProfile from "../infrastructure/schemas/UserProfile";
import { upsertUserProfileDTO } from "../domain/dtos/user";
import ValidationError from "../domain/errors/validation-error";
import Artist from "../infrastructure/schemas/Artist";

const ensureProtocol = (url: string | undefined): string | undefined => {
  const trimmed = (url || "").trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const getMe = async (
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

    const profile = await UserProfile.findOne({ clerkUserId: userId });
    res.status(200).json(profile || {});
    return;
  } catch (error) {
    next(error);
  }
};

export const upsertMe = async (
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

    const parsed = upsertUserProfileDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new ValidationError("Invalid profile data");
    }

    const payload = parsed.data;
    const normalized = {
      displayName: payload.displayName.trim(),
      bio: payload.bio.trim(),
      country: payload.country,
      city: payload.city.trim(),
      website: ensureProtocol(payload.website)!,
      instagram: ensureProtocol(payload.instagram)!,
      facebook: ensureProtocol(payload.facebook)!,
      avatarUrl: ensureProtocol(payload.avatarUrl),
    } as const;

    const updated = await UserProfile.findOneAndUpdate(
      { clerkUserId: userId },
      { $set: { clerkUserId: userId, ...normalized } },
      { upsert: true, new: true }
    );

    // If the user already has an Artist document, sync mutable fields only
    const existingArtist = await Artist.findOne({ clerkUserId: userId });
    if (existingArtist) {
      await Artist.updateOne(
        { _id: (existingArtist as any)._id },
        {
          $set: {
            name: normalized.displayName,
            bio: normalized.bio,
            country: normalized.country,
            city: normalized.city,
            website: normalized.website,
            instagram: normalized.instagram,
            facebook: normalized.facebook,
          },
        }
      );
    }

    res.status(200).json(updated);
    return;
  } catch (error) {
    next(error);
  }
};
