"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

let globalCount = 1;
let globalEnabled = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let globalChannel: any = null;
const listeners = new Set<(state: { count: number; enabled: boolean }) => void>();

function notify() {
  listeners.forEach((listener) => listener({ count: globalCount, enabled: globalEnabled }));
}

function initPresence() {
  if (globalChannel || typeof window === "undefined") return;

  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  globalEnabled = true;
  notify();

  try {
    const channelId =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    globalChannel = supabase.channel("portfolio-visitors", {
      config: { presence: { key: channelId } }
    });

    globalChannel
      .on("presence", { event: "sync" }, () => {
        try {
          if (!globalChannel) return;
          const state = globalChannel.presenceState();
          globalCount = Math.max(1, Object.keys(state).length);
          notify();
        } catch {
          // ignore sync error
        }
      })
      .subscribe(async (status: string) => {
        if (status === "SUBSCRIBED" && globalChannel) {
          try {
            await globalChannel.track({ onlineAt: new Date().toISOString() });
          } catch {
            // ignore track error
          }
        }
      });
  } catch {
    // Graceful fallback if channel creation fails
  }
}

export function useVisitorPresence() {
  const [presence, setPresence] = useState({ count: globalCount, enabled: globalEnabled });

  useEffect(() => {
    listeners.add(setPresence);
    initPresence();

    return () => {
      listeners.delete(setPresence);
    };
  }, []);

  return presence;
}