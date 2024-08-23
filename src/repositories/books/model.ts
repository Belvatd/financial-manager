import { z } from "zod";

export const BookSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  book_name: z.string().min(1, { message: "input your book name" }),
  description: z.string().optional(),
  start_period: z.string().min(1, { message: "input your start period" }),
  end_period: z.string().min(1, { message: "input your end period" }),
});

export type TBookSchema = z.infer<typeof BookSchema>;
