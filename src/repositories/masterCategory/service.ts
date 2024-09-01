/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TMasterCategorySchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const tableName = "master_category";
const key = "master_category";

const createMasterCategory = async (data: TMasterCategorySchema) => {
  const res = await supabaseClient
    .from(tableName)
    .insert(data)
    .select("*")
    .single();
  return res.data;
};
export function useCreateMasterCategory() {
  const mutationFn = async (data: TMasterCategorySchema) => {
    return createMasterCategory(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "create"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const getMasterCategory = async () => {
  const res = await supabaseClient.from(tableName).select("*");
  return res.data;
};
export function useMasterCategoryFindAll() {
  const queryFn = async () => {
    return getMasterCategory();
  };
  return useQuery({
    queryKey: [key, "all"],
    queryFn,
  });
}

const getMasterCategoryById = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();
  return res.data;
};
export function useGetMasterCategoryById(id: string) {
  const queryFn = async () => {
    if (!id) return {};
    return getMasterCategoryById(id);
  };
  return useQuery({
    queryKey: [key, id],
    queryFn,
  });
}

const editMasterCategory = async (data: TMasterCategorySchema) => {
  const { id, ...rest } = data;
  const res = await supabaseClient
    .from(tableName)
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditMasterCategory() {
  const mutationFn = async (data: TMasterCategorySchema) => {
    return editMasterCategory(data).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}

const deleteMasterCategory = async (id: string) => {
  const res = await supabaseClient
    .from(tableName)
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteMasterCategory() {
  const mutationFn = async (id: string) => {
    return deleteMasterCategory(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: [key, "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries([key, "all"] as InvalidateQueryFilters),
  });
}
