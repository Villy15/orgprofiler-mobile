// src/hooks/useHealthz.ts
import { apiClient } from "@/lib/api-client";
import { useCallback, useEffect, useState } from "react";

type HealthStatus = "loading" | "ok" | "down";

export function useHealthz(pollMs = 0) {
  const [status, setStatus] = useState<HealthStatus>("loading");
  const [message, setMessage] = useState<string>("");

  const check = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await apiClient.get("/healthz", { timeout: 6000 });
      const data = res.data;
      if (data?.ok === true) {
        setStatus("ok");
      } else {
        setStatus("down");
        setMessage("ok=false");
      }
    } catch (e: any) {
      setStatus("down");
      if (e?.code === "ECONNABORTED") {
        setMessage("Request timed out");
      } else if (e?.response) {
        setMessage(`HTTP ${e.response.status}`);
      } else {
        setMessage(e?.message ?? "Network error");
      }
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
