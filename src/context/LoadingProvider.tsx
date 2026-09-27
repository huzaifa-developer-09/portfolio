import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Loading from "../components/Loading";

interface LoadingType {
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  setLoading: (percent: number) => void;
}

export const LoadingContext = createContext<LoadingType | null>(null);

export const LoadingProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(() => {
    // The 3D scene only mounts on desktop.
    if (window.innerWidth <= 1024) return false;
    return true;
  });
  const [loading, setLoading] = useState(0);

  const value = useMemo(
    () => ({ isLoading, setIsLoading, setLoading }),
    [isLoading]
  );
  useEffect(() => {
    if (window.innerWidth > 1024) return;
    let cancelled = false;
    let timeoutId: number | undefined;
    import("../components/utils/initialFX").then((module) => {
      if (!cancelled && module.initialFX) {
        timeoutId = window.setTimeout(module.initialFX, 100);
      }
    });
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <Loading percent={loading} />}
      <main className="main-body">{children}</main>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
