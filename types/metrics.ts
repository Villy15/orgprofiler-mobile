// metrics.ts
import type { AnalysisResults } from "@/types";

export type MetricItem = { label: string; key: keyof AnalysisResults };
export type MetricGroup = { title: string; items: MetricItem[] };
export type MetricSection =
  | { title: string; items: MetricItem[]; groups?: never }
  | { title: string; groups: MetricGroup[]; items?: never };

export const METRIC_SECTIONS: MetricSection[] = [
  {
    title: "Identification",
    items: [
      { label: "Day", key: "day" },
      { label: "Organoid number", key: "organoidNumber" },
      { label: "Growth Rate", key: "growthRate" },
    ],
  },
  {
    title: "Size & Shape",
    groups: [
      {
        title: "Core size",
        items: [
          { label: "Area", key: "area" },
          { label: "Perimeter", key: "perim" },
          { label: "Equivalent circle diameter", key: "eqDiam" },
        ],
      },
      {
        title: "Shape descriptors",
        items: [
          { label: "Circularity", key: "circ" },
          { label: "Roundness", key: "round" },
          { label: "Solidity", key: "solidity" },
          { label: "Aspect ratio", key: "ar" },
        ],
      },
      {
        title: "Ellipse fit",
        items: [
          { label: "Ellipse major axis", key: "major" },
          { label: "Ellipse minor axis", key: "minor" },
          { label: "Angle", key: "angle" },
        ],
      },
    ],
  },
  {
    title: "Feret Measurements",
    groups: [
      {
        title: "Extrema",
        items: [
          { label: "Feret maximum", key: "feret" },
          { label: "Feret minimum", key: "minFeret" },
        ],
      },
      {
        title: "Orientation",
        items: [
          { label: "Feret X", key: "feretX" },
          { label: "Feret Y", key: "feretY" },
          { label: "Feret angle", key: "feretAngle" },
        ],
      },
    ],
  },
  {
    title: "Intensity",
    groups: [
      {
        title: "Corrected",
        items: [
          { label: "Corrected total intensity", key: "corrTotalInt" },
          { label: "Corrected mean intensity", key: "corrMeanInt" },
          { label: "Corrected minimum intensity", key: "corrMinInt" },
          { label: "Corrected maximum intensity", key: "corrMaxInt" },
        ],
      },
      {
        title: "Raw (ROI)",
        items: [
          { label: "Integrated intensity", key: "rawIntDen" },
          { label: "Mean intensity", key: "mean" },
          { label: "Median intensity", key: "median" },
          { label: "Mode intensity", key: "mode" },
          { label: "Intensity standard deviation", key: "stdDev" },
          { label: "Skewness", key: "skew" },
          { label: "Kurtosis", key: "kurt" },
          { label: "Min", key: "min" },
          { label: "Max", key: "max" },
        ],
      },
    ],
  },
  {
    title: "Distances",
    items: [{ label: "Centroid → COM distance", key: "centroidToCom" }],
  },
];
