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
import { MasterCategorySchema } from "@/repositories/masterCategory/model";
import { useCreateMasterCategory } from "@/repositories/masterCategory/service";

export default function MasterCategoryFormAdd({
  children,
  open,
  setOpen,
}: {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();
  const { mutate, isPending, error: errorCreate } = useCreateMasterCategory();

  const formDefaultValues = useMemo(
    () => ({
      user_id: user?.id ?? "",
      name: "",
    }),
    [user]
  );

  const form = useForm<z.infer<typeof MasterCategorySchema>>({
    resolver: zodResolver(MasterCategorySchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset(formDefaultValues);
    }
  }, [form, formDefaultValues, open]);

  async function onSubmit(values: z.infer<typeof MasterCategorySchema>) {
    try {
      mutate(values);
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
      label: "Category Name",
      placeholder: "example: Salary from Company",
    },
  ];

  return (
    <Dialog modal open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90dvw]">
        <DialogHeader>
          <DialogTitle>Create Expense Category</DialogTitle>
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
              {isPending ? "Loading..." : "Create"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
