import express from "express";
import { getOverviewCounts } from "../application/admin";
import { isAuthenticated } from "./middleware/authentication-middleware";
import { isAdmin } from "./middleware/authorization-middleware";

const adminRouter = express.Router();

adminRouter.get("/overview", isAuthenticated, isAdmin, getOverviewCounts);

export default adminRouter;
