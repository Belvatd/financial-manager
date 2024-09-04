/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TSheetIncomeSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "sheet_income";
const key = "sheet_income";

const createSheetIncome = async (data: TSheetIncomeSchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateSheetIncome() {
  const mutationFn = async (data: TSheetIncomeSchema) => {
    return createSheetIncome(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getSheetIncome = async (bookId:string) => {
  const res = await supabaseClient.from(tableName).select("*, master_income (name, nominal)").eq("book_id", bookId);
  return res.data;
};
export function useSheetIncomeFindAll(bookId:string) {
  const queryFn = async () => {
    if (!bookId) return {};
    return getSheetIncome(bookId);
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getSheetIncomeById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetSheetIncomeById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getSheetIncomeById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editSheetIncome = async (data: TSheetIncomeSchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditSheetIncome() {
  const mutationFn = async (data: TSheetIncomeSchema) => {
    return editSheetIncome(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteSheetIncome = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteSheetIncome() {
  const mutationFn = async (id: string) => {
    return deleteSheetIncome(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
