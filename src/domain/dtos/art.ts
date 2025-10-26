import { z } from "zod";

export const createArtDTO = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  //   TODO: Research and use accurate proper art categories
  category: z.enum([
    "Painting",
    "Sculpture",
    "Photography",
    "Mixed Media",
    "Digital Art",
    "Other",
  ]),
  price: z.number().positive(),
  images: z.array(z.string().min(1)).min(1).max(5),
  availability: z.enum(["For Sale", "Not for Sale", "Sold"]),
  likes: z.number().optional(),
  views: z.number().optional(),
  comments: z.number().optional(),
  likedBy: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

// Export CreateArtDTO TypeScript type inferred from the Zod schemas
export type CreateArtDTO = z.infer<typeof createArtDTO>;

export const updateArtDTO = z.object({
  title: z.string().min(1),
  artistName: z.string().min(1).optional(),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string().min(1)).min(1).max(5),
  availability: z.enum(["For Sale", "Not for Sale", "Sold"]),
  likes: z.number().optional(),
  views: z.number().optional(),
  comments: z.number().optional(),
  likedBy: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
});

// Export UpdateArtDTO TypeScript type inferred from the Zod schemas
export type UpdateArtDTO = z.infer<typeof updateArtDTO>;
