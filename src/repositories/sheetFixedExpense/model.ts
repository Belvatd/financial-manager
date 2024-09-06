import { z } from "zod";

export const SheetFixedExpenseSchema = z.object({
  id: z.string().optional(),
  master_fixed_id: z.string(),
  book_id: z.string(),
  master_fixed: z
    .object({
      name: z.string().optional(),
      nominal: z.number().optional(),
    })
    .optional(),
});

export type TSheetFixedExpenseSchema = z.infer<typeof SheetFixedExpenseSchema>;
