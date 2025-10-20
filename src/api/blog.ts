import express from "express";
import { createBlog, getAllBlogs } from "../application/blog";

const blogsRouter = express.Router();

blogsRouter.route("/").get(getAllBlogs).post(createBlog);

export default blogsRouter;
