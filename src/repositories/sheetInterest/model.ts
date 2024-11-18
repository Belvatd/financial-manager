import { z } from "zod";

export const SheetInterestSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "input your variable expense name" }),
  nominal: z
    .string({ required_error: "input variable expense nominal" })
    .or(z.number({ required_error: "input variable expense nominal" })),
  book_id: z.string(),
});

export type TSheetInterestSchema = z.infer<typeof SheetInterestSchema>;