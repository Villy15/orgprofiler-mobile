import { MetricsPanel } from "@/components/metrics-panel";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrgProfilerStore } from "@/store/useOrgProfilerStore";
import { METRIC_SECTIONS } from "@/types/metrics";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export default function ResultDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useOrgProfilerStore((s) => s.getAnalyzedItem(String(id)));

  if (!item) {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <Stack.Screen options={{ title: "Result" }} />
        <ThemedText type="defaultSemiBold">Not found</ThemedText>
        <ThemedText type="default">
          The analyzed item is missing. Try re-running analysis.
        </ThemedText>
        <Pressable
          onPress={() => router.back()}
          style={[styles.btn, styles.btnGhost]}
        >
          <ThemedText type="defaultSemiBold">Go Back</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Stack.Screen options={{ title: item.filename }} />

      <ThemedText type="title">{item.filename}</ThemedText>
      <ThemedText type="default" style={{ opacity: 0.6 }}>
        Analyzed at {new Date(item.analyzedAt).toLocaleString()}
      </ThemedText>

      {/* Images */}
      <View style={styles.grid2}>
        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">ROI Overlay</ThemedText>
          <Image
            source={{ uri: item.roi_image }}
            style={styles.bigImg}
            contentFit="contain"
          />
        </ThemedView>
        <ThemedView style={styles.card}>
          <ThemedText type="defaultSemiBold">Mask</ThemedText>
          <Image
            source={{ uri: item.mask_image }}
            style={styles.bigImg}
            contentFit="contain"
          />
        </ThemedView>
      </View>

      {/* Metrics */}
      <MetricsPanel sections={METRIC_SECTIONS} results={item.results} />

      <Pressable
        onPress={() => router.back()}
        style={[styles.btn, styles.btnGhost]}
      >
        <ThemedText type="defaultSemiBold">Back</ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid2: {
    gap: 12,
  },
  card: {
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bigImg: {
    width: "100%",
    height: 240,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  kv: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnGhost: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
