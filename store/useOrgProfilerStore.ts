// store/useOrgProfilerStore.ts
import type { AnalyzedItem } from "@/types";
import { create } from "zustand";

type SelectedFile = {
  uri: string;
  name: string;
  mimeType: string;
  size: number | null;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

type OrgProfilerState = {
  files: SelectedFile[];
  setFiles: (f: SelectedFile[]) => void;
  updateFile: (name: string, patch: Partial<SelectedFile>) => void;
  resetFiles: () => void;

  // New: analyzed items
  analyzedById: Record<string, AnalyzedItem>;
  addAnalyzedItem: (item: AnalyzedItem) => void;
  getAnalyzedItem: (id: string) => AnalyzedItem | undefined;
  clearAnalyzed: () => void;
};

export const useOrgProfilerStore = create<OrgProfilerState>((set, get) => ({
  files: [],
  setFiles: (files) => set({ files }),
  updateFile: (name, patch) =>
    set((s) => ({
      files: s.files.map((f) => (f.name === name ? { ...f, ...patch } : f)),
    })),
  resetFiles: () => set({ files: [] }),

  analyzedById: {},
  addAnalyzedItem: (item) =>
    set((s) => ({ analyzedById: { ...s.analyzedById, [item.id]: item } })),
  getAnalyzedItem: (id) => get().analyzedById[id],
  clearAnalyzed: () => set({ analyzedById: {} }),
}));
