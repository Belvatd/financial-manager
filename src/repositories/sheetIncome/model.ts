import { z } from "zod";

export const SheetIncomeSchema = z.object({
  id: z.string().optional(),
  master_income_id: z.string(),
  book_id: z.string(),
  master_income: z
    .object({
      name: z.string().optional(),
      nominal: z.number().optional(),
    })
    .optional(),
});

export type TSheetIncomeSchema = z.infer<typeof SheetIncomeSchema>;
