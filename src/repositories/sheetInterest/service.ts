/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TSheetInterestSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "sheet_interest";
const key = "sheet_interest";

const createSheetInterest = async (data: TSheetInterestSchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateSheetInterest() {
  const mutationFn = async (data: TSheetInterestSchema) => {
    return createSheetInterest(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getSheetInterest = async (bookId: string) => {
  const res = await supabaseClient.from(tableName).select("*").eq("book_id", bookId);
  return res.data;
};
export function useSheetInterestFindAll(bookId: string) {
  const queryFn = async () => {
    if (!bookId) return {};
    return getSheetInterest(bookId);
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getSheetInterestById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetSheetInterestById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getSheetInterestById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editSheetInterest = async (data: TSheetInterestSchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditSheetInterest() {
  const mutationFn = async (data: TSheetInterestSchema) => {
    return editSheetInterest(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteSheetInterest = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteSheetInterest() {
  const mutationFn = async (id: string) => {
    return deleteSheetInterest(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
