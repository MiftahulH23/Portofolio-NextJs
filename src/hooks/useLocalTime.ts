"use client";

import { useSyncExternalStore } from "react";

export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(date);
}

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 15_000);
  return () => window.clearInterval(id);
}

export function useLocalTime(timeZone: string): string {
  return useSyncExternalStore(
    subscribe,
    () => formatTime(new Date(), timeZone),
    () => "",
  );
}
