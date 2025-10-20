import { Request, Response, NextFunction } from "express";
import Blog from "../infrastructure/schemas/Blog";
import { createBlogDTO, updateBlogDTO } from "../domain/dtos/blog";

import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validation-error";

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blogs = await Blog.find();
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

    // Create the blog
    const blog = await Blog.create(createdBlog.data);

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
