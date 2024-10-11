import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateBook } from "@/repositories/books/service";
import { BookSchema } from "@/repositories/books/model";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/helper/AuthProvider";
import { ReactNode, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function BookFormAdd({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { mutate, isPending } = useCreateBook();

  const formDefaultValues = useMemo(
    () => ({
      user_id: user?.id ?? "",
      book_name: "",
      description: "",
      start_period: "",
      end_period: "",
    }),
    [user]
  );

  const form = useForm<z.infer<typeof BookSchema>>({
    resolver: zodResolver(BookSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset(formDefaultValues);
    }
  }, [form, formDefaultValues, open]);

  async function onSubmit(values: z.infer<typeof BookSchema>) {
    try {
      mutate(values, {
        onError: (error) => {
          console.log(error);
          setOpen(false);
        },
      });
    } finally {
      setOpen(false);
      form.reset(formDefaultValues);
    }
  }

  const formSchema = [
    {
      name: "book_name" as const,
      type: "text",
      label: "Name",
      placeholder: "example: August 2024",
    },
    {
      name: "description" as const,
      type: "text",
      label: "Description (Optional)",
      placeholder: "Description of your monthly book",
    },
    {
      name: "start_period" as const,
      type: "date",
      label: "Start Period",
      placeholder: "Start Period",
    },
    {
      name: "end_period" as const,
      type: "date",
      label: "End Period",
      placeholder: "End Period",
    },
  ];

  return (
    <Dialog modal open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Create New Book</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input
              type="hidden"
              {...form.register("user_id")}
              data-testid="user-id"
            />
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
              {isPending ? "Loading..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
