export interface FormData {
  name: string;
  gender: "male" | "female";
  options: string[];
  signatureDataUrl: string;
  updatedAt: number;
}

export const AVAILABLE_OPTIONS = [
  { id: "optionA", label: "選項 A / Option A" },
  { id: "optionB", label: "選項 B / Option B" },
  { id: "optionC", label: "選項 C / Option C" },
  { id: "optionD", label: "選項 D / Option D" },
] as const;

export type OptionId = (typeof AVAILABLE_OPTIONS)[number]["id"];

