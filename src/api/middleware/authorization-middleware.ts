import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import ForbiddenError from "../../domain/errors/forbidden-error";

/**
 * Middleware to check if a user has admin role
 * Verifies if the authenticated user has the 'admin' role in session claims
 * Throws a ForbiddenError if the user is not an admin
 */
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = getAuth(req);
    const sessionClaims: any = auth?.sessionClaims as any;
    let roleFromClaims =
      sessionClaims?.metadata?.role ??
      sessionClaims?.publicMetadata?.role ??
      sessionClaims?.public_metadata?.role ??
      sessionClaims?.role;

    if (!roleFromClaims && auth?.userId) {
      const user = await clerkClient.users.getUser(auth.userId);
      roleFromClaims =
        (user?.publicMetadata as any)?.role ??
        (user?.privateMetadata as any)?.role ??
        (user?.unsafeMetadata as any)?.role;
    }

    if (roleFromClaims !== "admin") {
      throw new ForbiddenError("Forbidden");
    }

    next();
  } catch (error) {
    next(error);
  }
};
