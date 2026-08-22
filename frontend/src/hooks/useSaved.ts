import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchSaved, saveSaved, deleteSaved } from "@/services/savedApi";

/**
 * Shared access to the saved-analyses list.
 *
 * Three components need this list at once (the saved page, the breakdown page,
 * and the save/unsave button), so it lives behind one query key: react-query
 * dedupes the concurrent requests and serves the rest from cache. The
 * mutations invalidate that key, so every consumer updates together.
 */
export const savedKeys = {
  all: ["saved"] as const,
};

export function useSavedList() {
  return useQuery({
    queryKey: savedKeys.all,
    queryFn: fetchSaved,
  });
}

export function useSaveAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSaved,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savedKeys.all }),
  });
}

export function useDeleteSaved() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSaved,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: savedKeys.all }),
  });
}
