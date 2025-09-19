import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useOrgProfilerStore } from "@/store/useOrgProfilerStore";
import { ScrollView, StyleSheet, TextInput } from "react-native";

function Field({
  label,
  value,
  onChangeText,
  keyboard = "numeric",
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboard?: "numeric" | "decimal-pad";
  placeholder?: string;
}) {
  return (
    <ThemedView style={{ gap: 6 }}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboard}
        inputMode={keyboard === "numeric" ? "numeric" : "decimal"}
        placeholder={placeholder}
        style={styles.input}
      />
    </ThemedView>
  );
}

export default function ParametersScreen() {
  const s = useOrgProfilerStore();

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Size Parameters</ThemedText>
        <Field
          label="Minimum Size (pixels)"
          value={s.minSizePx}
          onChangeText={(t) => s.setParam("minSizePx", t)}
          placeholder="60000"
        />
        <Field
          label="Maximum Size (pixels)"
          value={s.maxSizePx}
          onChangeText={(t) => s.setParam("maxSizePx", t)}
          placeholder="20000000"
        />
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Detection Parameters</ThemedText>
        <Field
          label="Area Threshold"
          value={s.areaThresholdPx}
          onChangeText={(t) => s.setParam("areaThresholdPx", t)}
          placeholder="20500000"
        />
        <Field
          label="Pixel Size (µm)"
          value={s.pixelSizeUm}
          onChangeText={(t) => s.setParam("pixelSizeUm", t)}
          keyboard="decimal-pad"
          placeholder="0.86"
        />
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Shape Parameters</ThemedText>
        <Field
          label="Minimum Circularity"
          value={s.minCircularity}
          onChangeText={(t) => s.setParam("minCircularity", t)}
          keyboard="decimal-pad"
          placeholder="0.28"
        />
        <Field
          label="Circularity Threshold"
          value={s.circThreshold}
          onChangeText={(t) => s.setParam("circThreshold", t)}
          keyboard="decimal-pad"
          placeholder="0.31"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="default" style={{ opacity: 0.6 }}>
          Your values are stored in app state and used by the Upload tab.
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, paddingVertical: 8 },
  card: {
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
  },
});
