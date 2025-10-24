import "dotenv/config";
import express from "express";
import connectDB from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import corsMiddleware from "./api/middleware/cors";
import { clerkMiddleware } from "@clerk/express";

import artistsRouter from "./api/artist";
import artsRouter from "./api/art";
import blogsRouter from "./api/blog";
import homepageRouter from "./api/homepage";
import adminRouter from "./api/admin";
import { signUpload } from "./api/middleware/cloudinary-url-middleware";
import { isAuthenticated } from "./api/middleware/authentication-middleware";
import { isAdmin } from "./api/middleware/authorization-middleware";
import { clerkClient } from "@clerk/express";

const app = express();

// Add Clerk authentication middleware
app.use(clerkMiddleware());

// Middleware to parse JSON data in the request body
// TODO: Implement authorization in the backend
app.use(express.json());

// Setup CORS logic
app.use(corsMiddleware);

// Connect to MongoDB database
connectDB();

// Register API routes
app.use("/api/artists", artistsRouter);
app.use("/api/arts", artsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/homepage", homepageRouter);
app.use("/api/admin", adminRouter);
// Upload signature
app.post("/api/uploads/sign", isAuthenticated, signUpload);

// Users public info proxy (minimal fields)
app.get("/api/users/public", async (req, res, next) => {
  try {
    const idsParam = String((req.query as any).ids || "").trim();
    if (!idsParam) return res.json([]);
    const ids = idsParam.split(",").filter(Boolean);
    const users = await Promise.all(
      ids.map((id) => clerkClient.users.getUser(id).catch(() => null))
    );
    const result = users.filter(Boolean).map((u: any) => ({
      id: u.id,
      fullName: u.fullName,
      imageUrl: u.imageUrl,
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Register global error handling middleware
app.use(globalErrorHandlingMiddleware);

// Export the app for Vercel deployment
export default app;

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
}
