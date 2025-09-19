import { apiClient } from "@/lib/api-client";
import { AnalyzedItem, AnalyzeResponse } from "@/types";
import * as Crypto from "expo-crypto";

export type RNFile = {
  uri: string;
  name: string;
  type: string;
  size?: number | null;
};
export type UploadFile = File | RNFile;

const isRNFile = (f: UploadFile): f is RNFile => !!(f as any)?.uri;

export type AnalyzeParams = {
  sigma_pre: number;
  erode_px: number;
  k: number;
  smooth_circle: boolean;
};

const DEFAULT_PARAMS: AnalyzeParams = {
  sigma_pre: 6.4,
  erode_px: 10,
  k: 5,
  smooth_circle: true,
};

type PostAnalyzeInput = {
  file: UploadFile;
  params?: Partial<AnalyzeParams>;
};

export const postAnalyze = async ({
  file,
  params,
}: PostAnalyzeInput): Promise<AnalyzedItem> => {
  const form = new FormData();
  if (isRNFile(file)) {
    // RN/Expo style
    form.append("file", file as any);
  } else {
    // Web/browser File
    form.append("file", file, file.name);
  }

  const qp = { ...DEFAULT_PARAMS, ...(params || {}) };

  const res = await apiClient.post<AnalyzeResponse>(
    "/analyze/brightfield",
    form,
    {
      params: qp,
      // If needed on RN:
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  const data = res.data;
  const filename = isRNFile(file) ? file.name : file.name;

  return {
    id: Crypto.randomUUID(),
    filename,
    analyzedAt: new Date().toISOString(),
    results: data.results,
    roi_image: data.roi_image,
    mask_image: data.mask_image,
  };
};
