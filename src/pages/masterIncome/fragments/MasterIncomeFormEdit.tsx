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
import {
  useEditMasterIncome,
  useGetMasterIncomeById,
} from "@/repositories/masterIncome/service";
import { MasterIncomeSchema } from "@/repositories/masterIncome/model";

export default function MasterIncomeFormEdit({
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
  const { user } = useAuth();
  const { mutate, isPending, error: errorEdit } = useEditMasterIncome();
  const { data, isLoading: isLoadingData } = useGetMasterIncomeById(
    dataId ?? ""
  );

  const formDefaultValues = useMemo(
    () => ({
      user_id: user?.id ?? "",
      name: "",
      nominal: "",
    }),
    [user]
  );

  const form = useForm<z.infer<typeof MasterIncomeSchema>>({
    resolver: zodResolver(MasterIncomeSchema),
    defaultValues: formDefaultValues,
  });

  useEffect(() => {
    if (data && !isLoadingData) {
      form.reset(data);
    }
  }, [data, form, isLoadingData, user?.id]);

  useEffect(() => {
    if (!open) {
      setDataId("");
    }
  }, [open, setDataId]);

  async function onSubmit(values: z.infer<typeof MasterIncomeSchema>) {
    try {
      mutate({ id: dataId, ...values });
      if (errorEdit) throw errorEdit;
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
      label: "Income Source Name",
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
          <DialogTitle>Edit Income</DialogTitle>
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
