/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TSheetVariableExpenseSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "sheet_variable_expense";
const key = "sheet_variable_expense";

const createSheetVariableExpense = async (data: TSheetVariableExpenseSchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateSheetVariableExpense() {
  const mutationFn = async (data: TSheetVariableExpenseSchema) => {
    return createSheetVariableExpense(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getSheetVariableExpense = async (bookId: string) => {
  const res = await supabaseClient.from(tableName).select("*, master_category (name)").eq("book_id", bookId);
  return res.data;
};
export function useSheetVariableExpenseFindAll(bookId: string) {
  const queryFn = async () => {
    if (!bookId) return {};
    return getSheetVariableExpense(bookId);
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getSheetVariableExpenseById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetSheetVariableExpenseById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getSheetVariableExpenseById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editSheetVariableExpense = async (data: TSheetVariableExpenseSchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditSheetVariableExpense() {
  const mutationFn = async (data: TSheetVariableExpenseSchema) => {
    return editSheetVariableExpense(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteSheetVariableExpense = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteSheetVariableExpense() {
  const mutationFn = async (id: string) => {
    return deleteSheetVariableExpense(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
