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
import { Input } from "@/components/ui/input";
import { useCreateSheetInterest } from "@/repositories/sheetInterest/service";
import { SheetInterestSchema } from "@/repositories/sheetInterest/model";

export default function SheetInterestFormAdd({
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
  const {
    mutate,
    isPending,
    error: errorCreate,
  } = useCreateSheetInterest();

  const formDefaultValues = useMemo(
    () => ({
      name: "",
      nominal: "",
      book_id: bookId,
    }),
    [bookId]
  );

  const form = useForm<z.infer<typeof SheetInterestSchema>>({
    resolver: zodResolver(SheetInterestSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset(formDefaultValues);
    }
  }, [form, formDefaultValues, open]);

  async function onSubmit(values: z.infer<typeof SheetInterestSchema>) {
    try {
      mutate({
        book_id: bookId,
        name: values.name,
        nominal: Number(values.nominal),
      });
      if (errorCreate) throw errorCreate;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setOpen(false);
      form.reset(formDefaultValues);
    }
  }

  const formSchema = [
    {
      name: "name" as const,
      type: "text",
      label: "Expense Name",
      placeholder: "example: Mandiri/BCA/Blu/etc.",
    },
    {
      name: "nominal" as const,
      type: "text",
      label: "Nominal",
      placeholder: "0",
    },
  ];

  return (
    <Dialog modal open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Add Interest</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {formSchema.map((item) => (
              <FormField
                key={item?.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={item.type}
                        placeholder={item.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button type="submit" className="w-full">
              {isPending ? "Loading..." : "Add"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
