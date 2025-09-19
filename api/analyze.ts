import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";
import { MutationConfig } from "@/lib/react-query";
import type { AnalyzeResponse, AnalyzedItem } from "@/types";

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
  file: File;
  params?: Partial<AnalyzeParams>;
};

const postAnalyze = async ({
  file,
  params,
}: PostAnalyzeInput): Promise<AnalyzedItem> => {
  const form = new FormData();
  form.append("file", file, file.name);

  const qp = { ...DEFAULT_PARAMS, ...(params || {}) };

  const res = await apiClient.post<AnalyzeResponse>(
    "/analyze/brightfield",
    form,
    { params: qp }
  );

  const data = res.data;
  const item: AnalyzedItem = {
    id: crypto.randomUUID(),
    filename: file.name,
    analyzedAt: new Date().toISOString(),
    results: data.results,
    roi_image: data.roi_image,
    mask_image: data.mask_image,
  };
  return item;
};

type UseAnalyzeImage = {
  mutationConfig?: MutationConfig<typeof postAnalyze>;
};

export const useAnalyzeImage = ({ mutationConfig }: UseAnalyzeImage = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: postAnalyze,
    onSuccess: (data, variables, context, mutation) => {
      onSuccess?.(data, variables, context, mutation);
    },
  });
};

const postAnalyzeFlorescence = async ({
  file,
  params,
}: PostAnalyzeInput): Promise<AnalyzedItem> => {
  const form = new FormData();
  form.append("file", file, file.name);

  const qp = { ...DEFAULT_PARAMS, ...(params || {}) };

  const res = await apiClient.post<AnalyzeResponse>(
    "/analyze/fluorescence",
    form,
    { params: qp }
  );

  const data = res.data;
  const item: AnalyzedItem = {
    id: crypto.randomUUID(),
    filename: file.name,
    analyzedAt: new Date().toISOString(),
    results: data.results,
    roi_image: data.roi_image,
    mask_image: data.mask_image,
  };
  return item;
};

export const useAnalyzeImageFlorescence = ({
  mutationConfig,
}: UseAnalyzeImage = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};
  return useMutation({
    ...restConfig,
    mutationFn: postAnalyzeFlorescence,
    onSuccess: (data, variables, context, mutation) => {
      onSuccess?.(data, variables, context, mutation);
    },
  });
};
