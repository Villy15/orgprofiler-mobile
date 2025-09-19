import { create } from "zustand";

export type SelectedFile = {
  id: string;
  uri: string;
  name: string;
  mimeType?: string | null;
  size?: number | null;
  progress?: number;
  status?: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type State = {
  files: SelectedFile[];
  pixelSizeUm: string;
  minSizePx: string;
  maxSizePx: string;
  areaThresholdPx: string;
  minCircularity: string;
  circThreshold: string;

  setFiles: (files: SelectedFile[]) => void;
  updateFile: (name: string, patch: Partial<SelectedFile>) => void;
  resetFiles: () => void;
  setParam: <K extends keyof State>(k: K, v: State[K]) => void;
};

export const useOrgProfilerStore = create<State>((set) => ({
  files: [],
  pixelSizeUm: "0.86",
  minSizePx: "60000",
  maxSizePx: "20000000",
  areaThresholdPx: "20500000",
  minCircularity: "0.28",
  circThreshold: "0.31",

  setFiles: (files) => set({ files }),
  updateFile: (name, patch) =>
    set((s) => ({
      files: s.files.map((f) => (f.name === name ? { ...f, ...patch } : f)),
    })),
  resetFiles: () => set({ files: [] }),
  setParam: (k, v) => set({ [k]: v } as any),
}));
