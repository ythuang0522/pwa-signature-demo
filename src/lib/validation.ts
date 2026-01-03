import { z } from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(1, "請輸入姓名 / Name is required")
    .max(100, "姓名過長 / Name is too long"),
  gender: z.enum(["male", "female"], {
    message: "請選擇性別 / Please select gender",
  }),
  options: z
    .array(z.string())
    .min(1, "請至少選擇一個選項 / Select at least one option"),
  signatureDataUrl: z
    .string()
    .min(1, "請簽名 / Signature is required"),
});

export type FormSchemaType = z.infer<typeof formSchema>;
