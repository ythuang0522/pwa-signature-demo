import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";
import { formSchema, type FormSchemaType } from "../lib/validation";
import { AVAILABLE_OPTIONS, type FormData } from "../lib/types";
import { saveDraft, loadDraft, clearDraft, formatDraftTime } from "../lib/storage";
import { SignatureField } from "./SignatureField";
import { PreviewDialog } from "./PreviewDialog";

export function FormCard() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<FormData | null>(null);
  const [draftTime, setDraftTime] = useState<string | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      gender: undefined,
      options: [],
      signatureDataUrl: "",
    },
  });

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.updatedAt) {
      setShowDraftBanner(true);
      setDraftTime(formatDraftTime(draft.updatedAt));
    }
  }, []);

  const restoreDraft = useCallback(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.name) setValue("name", draft.name);
      if (draft.gender) setValue("gender", draft.gender);
      if (draft.options) setValue("options", draft.options);
      if (draft.signatureDataUrl) setValue("signatureDataUrl", draft.signatureDataUrl);
      setShowDraftBanner(false);
    }
  }, [setValue]);

  const dismissDraft = useCallback(() => {
    clearDraft();
    setShowDraftBanner(false);
  }, []);

  // Auto-save draft
  const watchedFields = watch();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (watchedFields.name || watchedFields.gender || watchedFields.options?.length) {
        saveDraft(watchedFields as Partial<FormData>);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [watchedFields]);

  const onSubmit = (data: FormSchemaType) => {
    const formData: FormData = {
      ...data,
      updatedAt: Date.now(),
    };
    setPreviewData(formData);
    setShowPreview(true);
  };

  const handleReset = () => {
    reset();
    clearDraft();
    setDraftTime(null);
  };

  const selectedGender = watch("gender");

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Draft Restore Banner */}
        {showDraftBanner && (
          <div className="animate-slide-up bg-[var(--color-primary-500)]/20 border border-[var(--color-primary-500)]/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[var(--color-primary-400)] shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-sm">發現草稿 / Draft Found</p>
                <p className="text-xs text-slate-400">
                  上次儲存: {draftTime}
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={restoreDraft}
                className="btn btn-primary py-2 px-4 text-sm flex-1 sm:flex-none"
              >
                還原 / Restore
              </button>
              <button
                type="button"
                onClick={dismissDraft}
                className="btn btn-secondary py-2 px-4 text-sm flex-1 sm:flex-none"
              >
                忽略 / Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Two-column layout on larger screens */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Form Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <label htmlFor="name" className="label">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[var(--color-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  姓名 / Name
                </span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`input-field ${errors.name ? "error" : ""}`}
                placeholder="請輸入姓名 / Enter your name"
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}
            </div>

            {/* Gender Field */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <label className="label">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[var(--color-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v-1a6 6 0 00-3-5.197"
                    />
                  </svg>
                  性別 / Gender
                </span>
              </label>
              <div className="radio-group">
                <label
                  className={`radio-item flex-1 ${
                    selectedGender === "male" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="male"
                    {...register("gender")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedGender === "male"
                        ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]"
                        : "border-slate-500"
                    }`}
                  >
                    {selectedGender === "male" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>男 / Male</span>
                </label>
                <label
                  className={`radio-item flex-1 ${
                    selectedGender === "female" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="female"
                    {...register("gender")}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedGender === "female"
                        ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]"
                        : "border-slate-500"
                    }`}
                  >
                    {selectedGender === "female" && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span>女 / Female</span>
                </label>
              </div>
              {errors.gender && (
                <p className="error-message">{errors.gender.message}</p>
              )}
            </div>

            {/* Options Field */}
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <label className="label">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-[var(--color-accent)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  選項 / Options
                  <span className="text-xs text-slate-400">
                    (至少選一項 / Select at least one)
                  </span>
                </span>
              </label>
              <Controller
                name="options"
                control={control}
                render={({ field }) => (
                  <div className="checkbox-group">
                    {AVAILABLE_OPTIONS.map((option) => {
                      const isSelected = field.value?.includes(option.id);
                      return (
                        <label
                          key={option.id}
                          className={`checkbox-item flex-1 min-w-[140px] ${
                            isSelected ? "selected" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...(field.value || []), option.id]
                                : field.value?.filter((v) => v !== option.id) || [];
                              field.onChange(newValue);
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? "border-[var(--color-primary-500)] bg-[var(--color-primary-500)]"
                                : "border-slate-500"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              {errors.options && (
                <p className="error-message">{errors.options.message}</p>
              )}
            </div>
          </div>

          {/* Right Column: Signature */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <Controller
              name="signatureDataUrl"
              control={control}
              render={({ field }) => (
                <SignatureField
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.signatureDataUrl?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <button type="submit" className="btn btn-primary flex-1 sm:flex-none">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            提交預覽 / Submit Preview
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn btn-secondary flex-1 sm:flex-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            重設 / Reset
          </button>
        </div>

        {/* Form status */}
        <div className="text-center text-xs text-slate-500">
          {isValid ? (
            <span className="text-[var(--color-success)]">
              ✓ 表單已完成填寫 / Form completed
            </span>
          ) : (
            <span>請填寫所有必填欄位 / Please complete all required fields</span>
          )}
        </div>
      </form>

      <PreviewDialog
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={previewData}
      />
    </>
  );
}

