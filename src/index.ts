import "dotenv/config";
import express from "express";
import connectDB from "./infrastructure/db";
import corsMiddleware from "./api/middleware/cors";
import { clerkMiddleware } from "@clerk/express";

import artistsRouter from "./api/artist";

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
