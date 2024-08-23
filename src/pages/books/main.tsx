import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/helper/AuthProvider";
import { BookSchema } from "@/repositories/books/model";
import { useBookFindAll, useCreateBook } from "@/repositories/books/service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Books() {
  const { user } = useAuth();
  const { data: books, isLoading } = useBookFindAll();
  const { mutate, isPending, error: errorCreate } = useCreateBook();
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

  async function onSubmit(values: z.infer<typeof BookSchema>) {
    try {
      mutate(values);
      if (errorCreate) throw errorCreate;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
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

  if (!isLoading) console.log(books);
  return (
    <div className="h-[100dvh] flex flex-col align-top">
      <div className="w-[100dvw] flex justify-between">
        <CardTitle>Books</CardTitle>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent align="center">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {formSchema.map((item) => (
                    <FormField
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
