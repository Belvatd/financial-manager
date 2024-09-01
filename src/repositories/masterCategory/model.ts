import { z } from "zod";

export const MasterCategorySchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  name: z.string().min(1, { message: "input expense category" }),
});

export type TMasterCategorySchema = z.infer<typeof MasterCategorySchema>;
