import { z } from "zod";

export const upsertUserProfileDTO = z.object({
  displayName: z.string().min(1),
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
  website: z.string().url(),
  instagram: z.string().url(),
  facebook: z.string().url(),
  avatarUrl: z.string().url().optional(),
});

export type UpsertUserProfileDTO = z.infer<typeof upsertUserProfileDTO>;
