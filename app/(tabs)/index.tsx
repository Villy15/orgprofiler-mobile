// app/index.tsx (your HomeScreen file)
import { postAnalyze } from "@/api/analyze";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useHealthz } from "@/hooks/use-healthz";
import { useOrgProfilerStore } from "@/store/useOrgProfilerStore";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

function StatusPill({ status }: { status: "loading" | "ok" | "down" }) {
  const bg =
    status === "ok" ? "#bbf7d0" : status === "down" ? "#fecaca" : "#fde68a";
  const text =
    status === "ok" ? "Online" : status === "down" ? "Offline" : "Checking…";
  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <ThemedText type="defaultSemiBold">{text}</ThemedText>
    </View>
  );
}

export default function HomeScreen() {
  const { status, message, check } = useHealthz();

  const {
    files,
    setFiles,
    updateFile,
    resetFiles,
    analyzedById,
    addAnalyzedItem,
  } = useOrgProfilerStore();

  const pickFiles = useCallback(async () => {
    const res = await DocumentPicker.getDocumentAsync({
      multiple: true,
      copyToCacheDirectory: true,
      type: ["image/jpeg", "image/png", "image/tiff"],
    });
    if (res.canceled) return;
    const mapped = res.assets.map((a) => ({
      uri: a.uri,
      name: a.name ?? "image",
      mimeType: a.mimeType ?? "image/jpeg",
      size: a.size ?? null,
      progress: 0,
      status: "pending" as const,
    }));
    setFiles(mapped);
  }, [setFiles]);

  const startAnalysis = useCallback(async () => {
    for (const f of files) {
      try {
        updateFile(f.name, { status: "uploading", progress: 1 });

        const upload = {
          uri: f.uri,
          name: f.name,
          type: f.mimeType ?? "image/jpeg",
        } as const;
        const item = await postAnalyze({ file: upload });

        addAnalyzedItem(item); // <-- store it
        updateFile(f.name, { status: "done", progress: 100 });
      } catch (e: any) {
        console.log("Error uploading file:", f.name, e);
        updateFile(f.name, { status: "error", progress: 0, error: e?.message });
      }
    }
  }, [files, updateFile, addAnalyzedItem]);

  const canAnalyze = files.length > 0;
  const analyzedItems = Object.values(analyzedById);

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Health row */}
      <ThemedView style={styles.healthRow}>
        <ThemedText type="defaultSemiBold">API</ThemedText>
        <StatusPill status={status} />
        {message ? (
          <ThemedText type="default" style={{ opacity: 0.6 }} numberOfLines={1}>
            {message}
          </ThemedText>
        ) : null}
        <Pressable onPress={check} style={styles.retryBtn}>
          <ThemedText type="defaultSemiBold">Retry</ThemedText>
        </Pressable>
      </ThemedView>

      {/* Picker card */}
      <ThemedView style={styles.card}>
        <ThemedText type="default" style={styles.muted}>
          Tap below to pick images. JPG is recommended (PNG/TIFF can be
          memory-heavy).
        </ThemedText>

        <Pressable onPress={pickFiles} style={styles.dropzone}>
          <ThemedText type="subtitle">Choose images</ThemedText>
          <ThemedText type="default" style={styles.mutedSmall}>
            Supports JPG, PNG, TIFF · Select multiple
          </ThemedText>
        </Pressable>

        {/* Selected files */}
        {files.length > 0 && (
          <ThemedView style={{ gap: 10 }}>
            {files.map((f) => (
              <ThemedView key={f.name} style={styles.itemRow}>
                <Image
                  source={{ uri: f.uri }}
                  style={styles.thumb}
                  contentFit="cover"
                />
                <ThemedView style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {f.name}
                  </ThemedText>
                  <ThemedText type="default" style={styles.mutedSmall}>
                    {f.status === "uploading" && "Uploading…"}
                    {f.status === "done" && "Completed"}
                    {f.status === "error" && `Error: ${f.error}`}
                    {f.status === "pending" && "Pending"}
                  </ThemedText>
                </ThemedView>
                <ThemedText type="defaultSemiBold">
                  {Math.round(f.progress ?? 0)}%
                </ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}

        <View style={styles.row}>
          <Pressable
            onPress={startAnalysis}
            disabled={!canAnalyze}
            style={[styles.buttonPrimary, !canAnalyze && styles.buttonDisabled]}
          >
            <ThemedText type="defaultSemiBold">Start Batch Analysis</ThemedText>
          </Pressable>
          <Pressable onPress={resetFiles} style={styles.buttonGhost}>
            <ThemedText type="defaultSemiBold">Clear</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      {/* Analyzed results list */}
      {analyzedItems.length > 0 && (
        <ThemedView style={[styles.card, { gap: 10 }]}>
          <ThemedText type="subtitle">Analyzed results</ThemedText>
          {analyzedItems.map((it) => (
            <Pressable
              key={it.id}
              onPress={() =>
                router.push({ pathname: "/result/[id]", params: { id: it.id } })
              }
            >
              <ThemedView style={styles.itemRow}>
                {/* Use ROI or mask preview */}
                <Image
                  source={{ uri: it.roi_image }}
                  style={styles.thumb}
                  contentFit="cover"
                />
                <ThemedView style={{ flex: 1 }}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {it.filename}
                  </ThemedText>
                  <ThemedText
                    type="default"
                    style={styles.mutedSmall}
                    numberOfLines={1}
                  >
                    {new Date(it.analyzedAt).toLocaleString()}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dropzone: {
    height: 160,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  muted: { opacity: 0.7 },
  mutedSmall: { opacity: 0.6, fontSize: 12 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  thumb: { width: 54, height: 54, borderRadius: 8, backgroundColor: "#e2e8f0" },
  row: { flexDirection: "row", gap: 12, marginTop: 6 },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#93c5fd",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#e2e8f0" },
  buttonGhost: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  healthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 8,
  },
  retryBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
});
