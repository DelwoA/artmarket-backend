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

    const payload = {
      featuredArtistIds: Array.isArray(body.featuredArtistIds)
        ? body.featuredArtistIds.map(String)
        : [],
      featuredArtIds: Array.isArray(body.featuredArtIds)
        ? body.featuredArtIds.map(String)
        : [],
      featuredBlogIds: Array.isArray(body.featuredBlogIds)
        ? body.featuredBlogIds.map(String)
        : [],
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
