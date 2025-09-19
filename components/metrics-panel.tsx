// components/metrics-panel.tsx
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import type { AnalysisResults } from "@/types";
import { MetricGroup, MetricItem, MetricSection } from "@/types/metrics";
import { StyleSheet, View } from "react-native";

function formatVal(v: unknown) {
  if (v == null) return "—";
  if (typeof v === "number" && Number.isFinite(v)) {
    // tweak decimals here per metric if needed
    const rounded = Math.round(v * 100) / 100;
    return `${rounded}`;
  }
  return String(v);
}

function MetricList({
  items,
  results,
}: {
  items: MetricItem[];
  results: AnalysisResults;
}) {
  return (
    <View style={styles.kvGrid}>
      {items.map(({ label, key }) => (
        <View key={String(key)} style={styles.kvRow}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.kLabel}
            numberOfLines={1}
          >
            {label}
          </ThemedText>
          <ThemedText type="default" style={styles.kValue} numberOfLines={1}>
            {formatVal(results[key])}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

function SectionCard({
  title,
  groups,
  items,
  results,
}: MetricSection & { results: AnalysisResults }) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle" style={{ marginBottom: 6 }}>
        {title}
      </ThemedText>

      {groups ? (
        groups.map((g: MetricGroup) => (
          <View key={g.title} style={{ marginTop: 8 }}>
            <ThemedText type="defaultSemiBold" style={styles.groupTitle}>
              {g.title}
            </ThemedText>
            <MetricList items={g.items} results={results} />
          </View>
        ))
      ) : items ? (
        <MetricList items={items} results={results} />
      ) : null}
    </ThemedView>
  );
}

export function MetricsPanel({
  sections,
  results,
}: {
  sections: MetricSection[];
  results: AnalysisResults;
}) {
  return (
    <View style={{ gap: 12 }}>
      {sections.map((s) => (
        <SectionCard key={s.title} {...s} results={results} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 4,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  groupTitle: {
    opacity: 0.75,
    marginBottom: 6,
  },
  kvGrid: {
    gap: 8,
  },
  kvRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  kLabel: { flex: 1, opacity: 0.9 },
  kValue: { flexShrink: 0, maxWidth: "45%", textAlign: "right" },
});
