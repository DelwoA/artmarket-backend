import { Request, Response, NextFunction } from "express";
import Artist from "../infrastructure/schemas/Artist";
import Blog from "../infrastructure/schemas/Blog";
import Art from "../infrastructure/schemas/Art";

export const getOverviewCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const [
      pendingArtists,
      pendingBlogs,
      bannedArtworks,
      totalArtists,
      totalArtworks,
    ] = await Promise.all([
      Artist.countDocuments({ status: "pending" }),
      Blog.countDocuments({ status: "pending" }),
      Art.countDocuments({ visible: false }),
      Artist.countDocuments({ status: "approved" }),
      Art.countDocuments({}),
    ]);

    res.status(200).json({
      pendingArtists,
      pendingBlogs,
      bannedArtworks,
      totalArtists,
      totalArtworks,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export default { getOverviewCounts };
