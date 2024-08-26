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
import { useBookFindById, useEditBook } from "@/repositories/books/service";
import { BookSchema } from "@/repositories/books/model";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/helper/AuthProvider";
import { ReactNode, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function BookFormEdit({
  children,
  bookId,
  setBookId,
  open,
  setOpen,
}: {
  children: ReactNode;
  bookId: string;
  setBookId: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { mutate, isPending, error: errorEdit } = useEditBook();
  const { data: bookData, isLoading: isLoadingData } = useBookFindById(
    bookId ?? ""
  );

  const form = useForm<z.infer<typeof BookSchema>>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      user_id: user?.id ?? "",
      book_name: "",
      description: "",
      start_period: "",
      end_period: "",
    },
  });

  useEffect(() => {
    if (bookData && !isLoadingData) {
      form.reset({
        user_id: bookData.user_id,
        book_name: bookData.book_name,
        description: bookData.description,
        start_period: bookData.start_period,
        end_period: bookData.end_period,
      });
    }
  }, [bookData, form, isLoadingData]);

  useEffect(() => {
    if (!open) {
      setBookId("");
    }
  }, [open, setBookId]);

  async function onSubmit(values: z.infer<typeof BookSchema>) {
    try {
      mutate({ id: bookId, ...values });
      if (errorEdit) throw errorEdit;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setOpen(false);
      form.reset({
        user_id: user?.id ?? "",
        book_name: "",
        description: "",
        start_period: "",
        end_period: "",
      });
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
          <DialogTitle>Edit Book Detail</DialogTitle>
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
              {isPending ? "Loading..." : "Edit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
