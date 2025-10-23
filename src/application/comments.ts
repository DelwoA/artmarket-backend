import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import Comment from "../infrastructure/schemas/Comment";
import Art from "../infrastructure/schemas/Art";
import NotFoundError from "../domain/errors/not-found-error";
import UnauthorizedError from "../domain/errors/unauthorized-error";
import ForbiddenError from "../domain/errors/forbidden-error";
import { createCommentDTO } from "../domain/dtos/comments";
import { clerkClient } from "@clerk/express";

export const getCommentsByArt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;
    const comments = await Comment.find({ artId }).sort({ createdAt: -1 });
    res.status(200).json(comments);
    return;
  } catch (error) {
    next(error);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;

    // Validate request body
    const parsed = createCommentDTO.safeParse(req.body);
    if (!parsed.success) {
      throw new NotFoundError("Invalid comment data");
    }

    // Ensure art exists
    const art = await Art.findById(artId);
    if (!art) {
      throw new NotFoundError("Art not found");
    }

    // Create the comment
    const created = await Comment.create({ ...parsed.data, artId });

    // Increment art comments count
    await Art.updateOne({ _id: artId }, { $inc: { comments: 1 } });

    res.status(201).json(created);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const artId = req.params.id;
    const commentId = req.params.commentId;
    const auth = getAuth(req);

    if (!auth || !auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }

    // Determine if user is admin
    let isAdmin = false;
    try {
      const user = await clerkClient.users.getUser(auth.userId);
      const role = ((user?.publicMetadata as any)?.role ||
        (user?.privateMetadata as any)?.role ||
        (user?.unsafeMetadata as any)?.role) as string | undefined;
      isAdmin = role === "admin" || role === "Admin";
    } catch {
      isAdmin = false;
    }

    const isOwner = comment.authorId === auth.userId;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenError("Forbidden");
    }

    await comment.deleteOne();
    await Art.updateOne({ _id: artId }, { $inc: { comments: -1 } });

    res.status(204).send();
    return;
  } catch (error) {
    next(error);
  }
};
