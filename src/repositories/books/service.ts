/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabaseClient } from "@/lib/helper/supabaseClient";
import { TBookSchema } from "./model";
import {
  InvalidateQueryFilters,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { queryClient } from "@/lib/helper/queryClients";

const createBook = async (book: TBookSchema) => {
  const res = await supabaseClient
    .from("books")
    .insert(book)
    .select("*")
    .single();
  return res.data;
};
export function useCreateBook() {
  const mutationFn = async (book: TBookSchema) => {
    return createBook(book).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: ["book", "create"],
    onSuccess: () =>
      queryClient.invalidateQueries(["book", "all"] as InvalidateQueryFilters),
  });
}

const getBook = async () => {
  const res = await supabaseClient.from("books").select("*");
  return res.data;
};
export function useBookFindAll() {
  const queryFn = async () => {
    return getBook();
  };
  return useQuery({
    queryKey: ["book", "all"],
    queryFn,
  });
}

const editBook = async (book: TBookSchema) => {
  const { id, ...rest } = book;
  const res = await supabaseClient
    .from("books")
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useEditBook() {
  const mutationFn = async (book: TBookSchema) => {
    return editBook(book).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: ["book", "edit"],
    onSuccess: () =>
      queryClient.invalidateQueries(["book", "all"] as InvalidateQueryFilters),
  });
}

const deleteBook = async (id: string) => {
  const res = await supabaseClient
    .from("books")
    .delete()
    .eq("id", id)
    .select("*")
    .single();
  return res.data;
};
export function useDeleteBook() {
  const mutationFn = async (id: string) => {
    return deleteBook(id).then((result: any) => result?.data);
  };
  return useMutation({
    mutationFn,
    mutationKey: ["book", "delete"],
    onSuccess: () =>
      queryClient.invalidateQueries(["book", "all"] as InvalidateQueryFilters),
  });
}
