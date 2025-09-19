import { AnalysisResults } from './analysis-results-type';

export type AnalyzedItem = {
  id: string;
  filename: string;
  analyzedAt: string;
  results: AnalysisResults;
  roi_image: string;
  mask_image: string;
  filepath?: string;
  subfolder?: string; // optional: set this when you ingest
  criteria?: string; // optional: set this in your app logic
};
