import { z } from "zod";

export const MasterFixedSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "input fixed expense name" }),
  nominal: z
    .string({ required_error: "input fixed expense nominal" })
    .or(z.number({ required_error: "input fixed expense nominal" })),
  master_category_id: z.string(),
  master_category: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
});

export type TMasterFixedSchema = z.infer<typeof MasterFixedSchema>;
