import { Request, Response, NextFunction } from "express";
import Blog from "../infrastructure/schemas/Blog";
import { createBlogDTO, updateBlogDTO } from "../domain/dtos/blog";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";
import { getAuth } from "@clerk/express";

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.find({ status: "approved" });
    res.status(200).json(blogs);
    return;
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Zod validator 'createBlogDTO' used.
    const createdBlog = createBlogDTO.safeParse(req.body);

    // Checking if the created blog is in the shape of 'createBlogDTO'
    if (!createdBlog.success) {
      throw new ValidationError("Invalid blog data");
    }

    // Create the blog with pending status and clerk user linkage
    const body = createdBlog.data as any;
    const blog = await Blog.create({
      ...body,
      status: "pending",
      clerkUserId: getAuth(req)?.userId,
    });

    // Return the response
    res.status(201).json(blog);
    return;
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.id;

    // Find the blog by id
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new NotFoundError("Blog not found");
    }

    // Return the response
    res.status(200).json(blog);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.id;

    // Zod validator 'updateBlogDTO' used.
    const updatedBlog = updateBlogDTO.safeParse(req.body);

    // Checking if the updated blog is in the shape of 'updateBlogDTO'
    if (!updatedBlog.success) {
      throw new ValidationError("Invalid blog data");
    }

    // Update the blog
    const blog = await Blog.findByIdAndUpdate(blogId, updatedBlog.data, {
      new: true,
    });

    // Return the response
    res.status(200).json(blog);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogId = req.params.id;

    // Delete the blog
    await Blog.findByIdAndDelete(blogId);

    // Return the response
    res.status(200).send("Blog deleted successfully");
    return;
  } catch (error) {
    next(error);
  }
};

// Admin list blogs by status
export const getAdminBlogs = async (
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
    const blogs = await Blog.find(filter).sort({ publishedAt: -1, _id: -1 });
    res.status(200).json(blogs);
    return;
  } catch (error) {
    next(error);
  }
};

export const approveBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        status: "approved",
        publishedAt: new Date(),
        $unset: { rejectionReason: 1 },
      },
      { new: true }
    );
    if (!blog) throw new NotFoundError("Blog not found");
    res.status(200).json(blog);
    return;
  } catch (error) {
    next(error);
  }
};

export const rejectBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const { reason } = req.body as { reason?: string };
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        status: "rejected",
        rejectionReason: reason,
        $unset: { publishedAt: 1 },
      },
      { new: true }
    );
    if (!blog) throw new NotFoundError("Blog not found");
    res.status(200).json(blog);
    return;
  } catch (error) {
    next(error);
  }
};
