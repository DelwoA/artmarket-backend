import { z } from "zod";

export const createBlogDTO = z.object({
  title: z.string().min(1),
  artistName: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  views: z.number().optional(),
  featured: z.boolean().optional(),
});

// Export CreateBlogDTO TypeScript type inferred from the Zod schemas
export type CreateBlogDTO = z.infer<typeof createBlogDTO>;

export const updateBlogDTO = z.object({
  title: z.string().min(1),
  artistName: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  views: z.number().optional(),
  featured: z.boolean().optional(),
});

// Export UpdateBlogDTO TypeScript type inferred from the Zod schemas
export type UpdateBlogDTO = z.infer<typeof updateBlogDTO>;
