import { z } from "zod";

export const SheetVariableExpenseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "input your variable expense name" }),
  nominal: z
    .string({ required_error: "input variable expense nominal" })
    .or(z.number({ required_error: "input variable expense nominal" })),
  book_id: z.string(),
  master_category_id: z.string(),
  master_category: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  date: z.string().min(1, { message: "input transaction date" }),
});

export type TSheetVariableExpenseSchema = z.infer<typeof SheetVariableExpenseSchema>;