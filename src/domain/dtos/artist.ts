import { z } from "zod";

export const createArtistDTO = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  bio: z.string().min(1),
  country: z.enum([
    "Australia",
    "Canada",
    "China",
    "France",
    "Germany",
    "India",
    "Italy",
    "Japan",
    "New Zealand",
    "Qatar",
    "Russia",
    "Saudi Arabia",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
  ]),
  city: z.string().min(1),
  website: z.string().url().optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url(),
  featured: z.boolean().optional(),
});

// Export CreateArtistDTO TypeScript type inferred from the Zod schemas
export type CreateArtistDTO = z.infer<typeof createArtistDTO>;

export const updateArtistDTO = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  bio: z.string().min(1),
  country: z.enum([
    "Australia",
    "Canada",
    "China",
    "France",
    "Germany",
    "India",
    "Italy",
    "Japan",
    "New Zealand",
    "Qatar",
    "Russia",
    "Saudi Arabia",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
  ]),
  city: z.string().min(1),
  website: z.string().url().optional(),
  instagram: z.string().url().optional(),
  facebook: z.string().url(),
  featured: z.boolean().optional(),
});

// Export UpdateArtistDTO TypeScript type inferred from the Zod schemas
export type UpdateArtistDTO = z.infer<typeof updateArtistDTO>;
