import type { FormData } from "./types";

const STORAGE_KEY = "pwa-form-draft";

export function saveDraft(data: Partial<FormData>): void {
  try {
    const draft: Partial<FormData> = {
      ...data,
      updatedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

export function loadDraft(): Partial<FormData> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Partial<FormData>;
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

export function formatDraftTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

