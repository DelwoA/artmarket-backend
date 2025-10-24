import { type RequestHandler } from "express";
import HomeConfig from "../infrastructure/schemas/HomeConfig";

// GET /api/homepage
export const getHomepageConfig: RequestHandler = async (_req, res, next) => {
  try {
    let doc = await HomeConfig.findOne();
    if (!doc) {
      doc = await HomeConfig.create({});
    }
    res.json({
      featuredArtistIds: doc.featuredArtistIds || [],
      featuredArtIds: doc.featuredArtIds || [],
      featuredBlogIds: doc.featuredBlogIds || [],
      updatedAt: doc.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/homepage
export const updateHomepageConfig: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as Partial<{
      featuredArtistIds: string[];
      featuredArtIds: string[];
      featuredBlogIds: string[];
    }>;

    const clampUnique = (ids: unknown[], max: number) => {
      const seen = new Set<string>();
      const result: string[] = [];
      for (const raw of Array.isArray(ids) ? ids : []) {
        const id = String(raw);
        if (!seen.has(id)) {
          seen.add(id);
          result.push(id);
          if (result.length >= max) break;
        }
      }
      return result;
    };

    const payload = {
      featuredArtistIds: clampUnique(body.featuredArtistIds ?? [], 4),
      featuredArtIds: clampUnique(body.featuredArtIds ?? [], 8),
      featuredBlogIds: clampUnique(body.featuredBlogIds ?? [], 6),
    };

    const doc = await HomeConfig.findOneAndUpdate({}, payload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.json({
      featuredArtistIds: doc.featuredArtistIds || [],
      featuredArtIds: doc.featuredArtIds || [],
      featuredBlogIds: doc.featuredBlogIds || [],
      updatedAt: doc.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};
