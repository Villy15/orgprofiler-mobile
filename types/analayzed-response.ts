import { AnalysisResults } from './analysis-results-type';

export type AnalyzeResponse = {
  results: AnalysisResults;
  roi_image: string;
  mask_image: string;
};
