import express from "express";
import {
  createBlog,
  getAllBlogs,
  getAdminBlogs,
  approveBlog,
  rejectBlog,
} from "../application/blog";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const blogsRouter = express.Router();

blogsRouter.route("/").get(getAllBlogs).post(isAuthenticated, createBlog);

// Admin endpoints
blogsRouter.get("/admin", isAuthenticated, isAdmin, getAdminBlogs);
blogsRouter.put("/admin/:id/approve", isAuthenticated, isAdmin, approveBlog);
blogsRouter.put("/admin/:id/reject", isAuthenticated, isAdmin, rejectBlog);

export default blogsRouter;
