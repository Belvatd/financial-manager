/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TMasterFixedSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "master_fixed";
const key = "master_fixed";

const createMasterFixed = async (data: TMasterFixedSchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateMasterFixed() {
  const mutationFn = async (data: TMasterFixedSchema) => {
    return createMasterFixed(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getMasterFixed = async () => {
  const { data, error } = await supabaseClient.from("master_fixed").select(`
      *,
      master_category (name)
    `);

  if (error) {
    throw error;
  }
  return data;
};
export function useMasterFixedFindAll() {
  const queryFn = async () => {
    return getMasterFixed();
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getMasterFixedById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetMasterFixedById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getMasterFixedById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editMasterFixed = async (data: TMasterFixedSchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditMasterFixed() {
  const mutationFn = async (data: TMasterFixedSchema) => {
    return editMasterFixed(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteMasterFixed = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteMasterFixed() {
  const mutationFn = async (id: string) => {
    return deleteMasterFixed(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
