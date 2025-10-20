import { z } from "zod";

export const createCommentDTO = z.object({
  comment: z.string().min(1),
  authorId: z.string().min(1),
  authorUsername: z.string().min(1),
  authorDisplayName: z.string().min(1),
  authorImage: z.string().min(1),
  authorRole: z.enum(["User", "Admin"]),
});

// Export CreateCommentDTO TypeScript type inferred from the Zod schemas
export type CreateCommentDTO = z.infer<typeof createCommentDTO>;

export const updateCommentDTO = z.object({
  title: z.string().min(1),
  artistName: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  views: z.number().optional(),
  featured: z.boolean().optional(),
});

// Export UpdateCommentDTO TypeScript type inferred from the Zod schemas
export type UpdateCommentDTO = z.infer<typeof updateCommentDTO>;
