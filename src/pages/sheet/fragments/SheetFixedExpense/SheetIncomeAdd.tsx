import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSheetIncome } from "@/repositories/sheetIncome/service";
import { useMasterIncomeFindAll } from "@/repositories/masterIncome/service";
import { SheetIncomeSchema } from "@/repositories/sheetIncome/model";

export default function SheetIncomeFormAdd({
  children,
  open,
  setOpen,
  bookId,
}: Readonly<{
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  bookId: string;
}>) {
  const { mutate, isPending, error: errorCreate } = useCreateSheetIncome();
  const { data: masterIncomeData } = useMasterIncomeFindAll();

  const formDefaultValues = useMemo(
    () => ({
      master_income_id: "",
      book_id: bookId,
    }),
    [bookId]
  );

  const form = useForm<z.infer<typeof SheetIncomeSchema>>({
    resolver: zodResolver(SheetIncomeSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset(formDefaultValues);
    }
  }, [form, formDefaultValues, open]);

  async function onSubmit(values: z.infer<typeof SheetIncomeSchema>) {
    try {
      mutate({ book_id: bookId, master_income_id: values.master_income_id });
      if (errorCreate) throw errorCreate;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setOpen(false);
      form.reset(formDefaultValues);
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Add Income Source</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="master_income_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income Source</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {masterIncomeData?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isPending ? "Loading..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
