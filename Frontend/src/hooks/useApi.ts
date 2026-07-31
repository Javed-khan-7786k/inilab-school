import { useState, useCallback, useRef, useEffect } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T, Args extends unknown[]>(
  apiFunc: (...args: Args) => Promise<T>,
  immediate = false,
  initialData: T | null = null
) {
  const apiFuncRef = useRef(apiFunc);
  
  useEffect(() => {
    apiFuncRef.current = apiFunc;
  }, [apiFunc]);

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const result = await apiFuncRef.current(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
        return null;
      }
    },
    []
  );

  return {
    ...state,
    execute,
    setData: (newData: T) => setState((prev) => ({ ...prev, data: newData })),
  };
}
