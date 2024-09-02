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
import { ReactNode, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { MasterFixedSchema } from "@/repositories/masterFixed/model";
import {
  useEditMasterFixed,
  useGetMasterFixedById,
} from "@/repositories/masterFixed/service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMasterCategoryFindAll } from "@/repositories/masterCategory/service";

export default function MasterFixedFormEdit({
  children,
  dataId,
  setDataId,
  open,
  setOpen,
}: {
  children: ReactNode;
  dataId: string;
  setDataId: (id: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: categoryData } = useMasterCategoryFindAll();
  const { mutate, isPending, error: errorEdit } = useEditMasterFixed();
  const { data, isLoading: isLoadingData } = useGetMasterFixedById(
    dataId ?? ""
  );

  const formDefaultValues = useMemo(
    () => ({
      name: "",
      nominal: "",
      master_category_id: "",
    }),
    []
  );

  const form = useForm<z.infer<typeof MasterFixedSchema>>({
    resolver: zodResolver(MasterFixedSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (data && !isLoadingData) {
      form.reset(data);
    }
  }, [data, form, isLoadingData]);

  useEffect(() => {
    if (!open) {
      setDataId("");
    }
  }, [open, setDataId]);

  async function onSubmit(values: z.infer<typeof MasterFixedSchema>) {
    try {
      const { nominal, ...rest } = values;
      mutate({ ...rest, nominal: Number(nominal) });
      if (errorEdit) throw errorEdit;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setOpen(false);
      form.reset(formDefaultValues);
    }
  }

  const formInputSchema = [
    {
      name: "name" as const,
      type: "text",
      label: "Expense Name",
      placeholder: "example: Salary from Company",
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
          <DialogTitle>Create Expense Category</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {formInputSchema.map((item) => (
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
            <FormField
              control={form.control}
              name="master_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select expense category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryData?.map((item) => (
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
              {isPending ? "Loading..." : "Edit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}