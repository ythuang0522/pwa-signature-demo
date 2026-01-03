import { useRef, useCallback, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureFieldProps {
  value: string;
  onChange: (dataUrl: string) => void;
  error?: string;
}

export function SignatureField({ value, onChange, error }: SignatureFieldProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClear = useCallback(() => {
    sigRef.current?.clear();
    onChange("");
  }, [onChange]);

  const handleEnd = useCallback(() => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      onChange(dataUrl);
    }
  }, [onChange]);

  // Restore signature if value exists (for draft restore)
  useEffect(() => {
    if (value && sigRef.current) {
      const canvas = sigRef.current.getCanvas();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          // Center the restored signature
          const x = (canvas.width - img.width) / 2;
          const y = (canvas.height - img.height) / 2;
          ctx.drawImage(img, Math.max(0, x), Math.max(0, y));
        };
        img.src = value;
      }
    }
  }, []);

  return (
    <div className="space-y-3">
      <label className="label flex items-center gap-2">
        <svg
          className="w-5 h-5 text-[var(--color-accent)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        簽名 / Signature
      </label>
      
      <div
        ref={containerRef}
        className={`relative rounded-xl overflow-hidden border-2 transition-colors ${
          error
            ? "border-[var(--color-error)]"
            : "border-[var(--color-surface-lighter)] hover:border-[var(--color-primary-400)]"
        }`}
      >
        {/* Canvas background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 opacity-95" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23334155' fill-opacity='0.3'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Signature line hint */}
        <div className="absolute bottom-8 left-4 right-4 border-b-2 border-dashed border-slate-300 opacity-50" />
        
        <SignatureCanvas
          ref={sigRef}
          penColor="#1e293b"
          canvasProps={{
            className: "relative z-10 w-full cursor-crosshair",
            style: {
              height: "200px",
              touchAction: "none",
            },
          }}
          onEnd={handleEnd}
        />
        
        {/* Status indicator */}
        {value && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 bg-green-500/90 text-white text-xs rounded-full">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            已簽名
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-secondary text-sm py-2 px-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          清除 / Clear
        </button>
        
        <span className="text-xs text-slate-400">
          請在上方區域簽名 / Please sign above
        </span>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

