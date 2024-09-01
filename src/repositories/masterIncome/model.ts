import { z } from "zod";

export const MasterIncomeSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  name: z.string().min(1, { message: "input your nominal source name" }),
  nominal: z
    .string({ required_error: "input your nominal income" })
    .or(z.number({ required_error: "input your nominal income" })),
});

export type TMasterIncomeSchema = z.infer<typeof MasterIncomeSchema>;
