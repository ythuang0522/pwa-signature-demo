import { useState, useRef, useEffect, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Scanner might already be stopped
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (!containerRef.current) return;
    
    setError(null);
    setIsInitializing(true);
    
    try {
      // Clean up existing scanner
      await stopScanner();
      
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      };

      await scanner.start(
        { facingMode: cameraFacing },
        config,
        (decodedText) => {
          // Success callback
          stopScanner();
          onScanSuccess(decodedText);
        },
        () => {
          // Error callback (called frequently when no QR code is detected)
          // We don't need to handle this
        }
      );
      
      setIsScanning(true);
      setIsInitializing(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start camera";
      
      if (message.includes("NotAllowedError") || message.includes("Permission")) {
        setError("相機權限被拒絕。請在設定中允許相機存取。\nCamera permission denied. Please allow camera access in settings.");
      } else if (message.includes("NotFoundError") || message.includes("device")) {
        setError("找不到相機裝置。\nNo camera device found.");
      } else {
        setError(`無法啟動相機: ${message}\nFailed to start camera: ${message}`);
      }
      setIsScanning(false);
      setIsInitializing(false);
    }
  }, [cameraFacing, onScanSuccess, stopScanner]);

  const toggleCamera = async () => {
    const newFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(newFacing);
  };

  // Auto-start camera on mount
  useEffect(() => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startScanner();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Restart scanner when camera facing changes (but not on first mount)
  useEffect(() => {
    if (hasStartedRef.current && isScanning) {
      startScanner();
    }
  }, [cameraFacing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const handleRetry = () => {
    setError(null);
    startScanner();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--color-surface-light)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700/50 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent)] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white">掃描 QR 碼</h3>
              <p className="text-xs text-slate-400">Scan QR Code</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-4">
          <div 
            ref={containerRef}
            className="relative bg-black rounded-xl overflow-hidden aspect-square"
          >
            <div id="qr-reader" className="w-full h-full" />
            
            {/* Loading state */}
            {isInitializing && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-surface)]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent)] flex items-center justify-center">
                  <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-sm text-center">
                  正在啟動相機...<br />
                  Starting camera...
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[var(--color-surface)] p-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-400 text-sm text-center whitespace-pre-line">{error}</p>
                <button
                  onClick={handleRetry}
                  className="btn btn-secondary py-2 px-4 text-sm"
                >
                  重試 / Retry
                </button>
              </div>
            )}

            {/* Scanning overlay */}
            {isScanning && !isInitializing && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner markers */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px]">
                  {/* Top-left corner */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[var(--color-primary-400)] rounded-tl-lg" />
                  {/* Top-right corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[var(--color-primary-400)] rounded-tr-lg" />
                  {/* Bottom-left corner */}
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[var(--color-primary-400)] rounded-bl-lg" />
                  {/* Bottom-right corner */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[var(--color-primary-400)] rounded-br-lg" />
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-primary-400)] to-transparent animate-scan" />
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <p className="text-center text-sm text-slate-400 mt-4">
            {isInitializing 
              ? "請稍候... / Please wait..."
              : isScanning 
                ? "將 QR 碼對準框內 / Align QR code within the frame" 
                : "準備就緒 / Ready to scan"}
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 pt-0 flex gap-3">
          {isScanning ? (
            <>
              <button
                onClick={toggleCamera}
                className="btn btn-secondary flex-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                切換鏡頭 / Switch
              </button>
              <button
                onClick={handleClose}
                className="btn btn-danger flex-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                關閉 / Close
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="btn btn-secondary flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              關閉 / Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
