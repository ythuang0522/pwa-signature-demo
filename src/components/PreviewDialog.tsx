import { useEffect, useRef } from "react";
import type { FormData } from "../lib/types";
import { AVAILABLE_OPTIONS } from "../lib/types";

interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: FormData | null;
}

export function PreviewDialog({ isOpen, onClose, data }: PreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  if (!data) return null;

  const getOptionLabel = (optionId: string) => {
    return AVAILABLE_OPTIONS.find((o) => o.id === optionId)?.label || optionId;
  };

  const jsonPreview = {
    name: data.name,
    gender: data.gender,
    options: data.options,
    signatureDataUrl: data.signatureDataUrl ? "[PNG Base64 DataURL]" : "",
    updatedAt: new Date(data.updatedAt).toISOString(),
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-[90vw] max-w-2xl max-h-[85vh] p-0 bg-transparent backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <div className="card animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[var(--color-success)]"
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
            預覽 / Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {/* Form Data Summary */}
          <div className="grid gap-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">姓名 / Name</span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">性別 / Gender</span>
              <span className="font-medium">
                {data.gender === "male" ? "男 / Male" : "女 / Female"}
              </span>
            </div>
            <div className="py-2 border-b border-slate-700/50">
              <span className="text-slate-400 block mb-2">選項 / Options</span>
              <div className="flex flex-wrap gap-2">
                {data.options.map((opt) => (
                  <span
                    key={opt}
                    className="px-3 py-1 bg-[var(--color-primary-500)]/20 text-[var(--color-primary-300)] rounded-full text-sm"
                  >
                    {getOptionLabel(opt)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Signature Preview */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              簽名 / Signature
            </h3>
            <div className="bg-white rounded-lg p-4 flex items-center justify-center">
              <img
                src={data.signatureDataUrl}
                alt="Signature"
                className="max-h-32 object-contain"
              />
            </div>
          </div>

          {/* JSON Preview */}
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              JSON 資料 / JSON Data
            </h3>
            <pre className="bg-[var(--color-surface)] rounded-lg p-4 text-sm overflow-x-auto text-green-400 font-mono">
              {JSON.stringify(jsonPreview, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-slate-700">
          <button onClick={onClose} className="btn btn-primary">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            關閉 / Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

