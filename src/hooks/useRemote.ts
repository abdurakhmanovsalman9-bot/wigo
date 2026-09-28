import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

type RemoteState<T> = { data: T | null; loading: boolean; error: boolean };

/** Loads server data whenever the screen gains focus. A null key means "nothing to load" (e.g. demo mode). */
export function useRemote<T>(key: string | null, load: () => Promise<T>) {
  const [state, setState] = useState<RemoteState<T>>({ data: null, loading: key !== null, error: false });
  const loadRef = useRef(load);
  useEffect(() => { loadRef.current = load; });

  const reload = useCallback(() => {
    if (key === null) return undefined;
    let active = true;
    setState((current) => ({ ...current, loading: true }));
    loadRef.current()
      .then((data) => { if (active) setState({ data, loading: false, error: false }); })
      .catch(() => { if (active) setState((current) => ({ ...current, loading: false, error: true })); });
    return () => { active = false; };
  }, [key]);

  useFocusEffect(reload);
  return { ...state, reload };
}
