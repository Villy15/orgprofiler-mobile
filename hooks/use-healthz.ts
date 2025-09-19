// src/hooks/useHealthz.ts
import { API_URL } from "@/lib/api-client";
import { useCallback, useEffect, useState } from "react";

type HealthStatus = "loading" | "ok" | "down";

export function useHealthz(pollMs = 0) {
  const [status, setStatus] = useState<HealthStatus>("loading");
  const [message, setMessage] = useState<string>("");

  const check = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const res = await fetch(`${API_URL}/healthz`, {
        signal: controller.signal,
      });
      clearTimeout(t);

      if (!res.ok) {
        setStatus("down");
        setMessage(`HTTP ${res.status}`);
        return;
      }
      const data = await res.json();
      if (data?.ok === true) {
        setStatus("ok");
      } else {
        setStatus("down");
        setMessage("ok=false");
      }
    } catch (e: any) {
      setStatus("down");
      setMessage(
        e?.name === "AbortError"
          ? "Request timed out"
          : e?.message ?? "Network error"
      );
    }
  }, []);

  useEffect(() => {
    check();
    if (pollMs > 0) {
      const id = setInterval(check, pollMs);
      return () => clearInterval(id);
    }
  }, [check, pollMs]);

  return { status, message, check };
}
