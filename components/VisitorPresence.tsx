"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function VisitorPresence() {
  const [count, setCount] = useState(1);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setEnabled(true);
    const channel = supabase.channel("portfolio-visitors", {
      config: { presence: { key: crypto.randomUUID() } }
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Math.max(1, Object.keys(state).length));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ onlineAt: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1 text-sm text-ink backdrop-blur">
      <Users className="h-4 w-4 text-moss" aria-hidden />
      <span>{enabled ? `${count} people viewing now` : "Visitor counter ready"}</span>
    </div>
  );
}
