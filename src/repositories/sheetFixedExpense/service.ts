/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TSheetFixedExpenseSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "sheet_fixed_expense";
const key = "sheet_fixed_expense";

const createSheetFixedExpense = async (data: TSheetFixedExpenseSchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateSheetFixedExpense() {
  const mutationFn = async (data: TSheetFixedExpenseSchema) => {
    return createSheetFixedExpense(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getSheetFixedExpense = async (bookId: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*, master_fixed (name, nominal)")
    .eq("book_id", bookId);
  return res.data;
};
export function useSheetFixedExpenseFindAll(bookId: string) {
  const queryFn = async () => {
    if (!bookId) return {};
    return getSheetFixedExpense(bookId);
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getSheetFixedExpenseById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetSheetFixedExpenseById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getSheetFixedExpenseById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editSheetFixedExpense = async (data: TSheetFixedExpenseSchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditSheetFixedExpense() {
  const mutationFn = async (data: TSheetFixedExpenseSchema) => {
    return editSheetFixedExpense(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteSheetFixedExpense = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteSheetFixedExpense() {
  const mutationFn = async (id: string) => {
    return deleteSheetFixedExpense(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
