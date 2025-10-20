import "dotenv/config";
import express from "express";
import connectDB from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import corsMiddleware from "./api/middleware/cors";
import { clerkMiddleware } from "@clerk/express";

import artistsRouter from "./api/artist";
import artsRouter from "./api/art";
import blogsRouter from "./api/blog";

const app = express();

// Add Clerk authentication middleware
app.use(clerkMiddleware());

// Middleware to parse JSON data in the request body
app.use(express.json());

// Setup CORS logic
app.use(corsMiddleware);

// Connect to MongoDB database
connectDB();

// Register API routes
app.use("/api/artists", artistsRouter);
app.use("/api/arts", artsRouter);
app.use("/api/blogs", blogsRouter);

// Register global error handling middleware
app.use(globalErrorHandlingMiddleware);

// Export the app for Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
}
