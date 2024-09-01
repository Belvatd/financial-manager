/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TMasterIncomeSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "master_income";
const key = "master_income";

const createMasterIncome = async (data: TMasterIncomeSchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateMasterIncome() {
  const mutationFn = async (data: TMasterIncomeSchema) => {
    return createMasterIncome(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getMasterIncome = async () => {
  const res = await supabaseClient.from(tableName).select("*");
  return res.data;
};
export function useMasterIncomeFindAll() {
  const queryFn = async () => {
    return getMasterIncome();
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getMasterIncomeById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetMasterIncomeById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getMasterIncomeById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editMasterIncome = async (data: TMasterIncomeSchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditMasterIncome() {
  const mutationFn = async (data: TMasterIncomeSchema) => {
    return editMasterIncome(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteMasterIncome = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteMasterIncome() {
  const mutationFn = async (id: string) => {
    return deleteMasterIncome(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
