import { useState } from "react";
import { QRScanner } from "./QRScanner";

interface ScanResult {
  data: string;
  timestamp: Date;
}

export function QRScannerDemo() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [latestScan, setLatestScan] = useState<string | null>(null);

  const handleScanSuccess = (decodedText: string) => {
    setLatestScan(decodedText);
    setScanHistory((prev) => [
      { data: decodedText, timestamp: new Date() },
      ...prev.slice(0, 9), // Keep last 10 scans
    ]);
    setShowScanner(false);
  };

  const clearHistory = () => {
    setScanHistory([]);
    setLatestScan(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Scan Button */}
      <div className="text-center">
        <button
          onClick={() => setShowScanner(true)}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-[var(--color-primary-500)] via-[var(--color-primary-600)] to-[var(--color-accent)] text-white font-semibold rounded-2xl shadow-lg shadow-[var(--color-primary-500)]/30 hover:shadow-xl hover:shadow-[var(--color-primary-500)]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          {/* QR Code Icon */}
          <div className="relative w-8 h-8 border-2 border-white/80 rounded-lg flex items-center justify-center">
            <div className="grid grid-cols-2 gap-0.5">
              <div className="w-2 h-2 bg-white rounded-sm" />
              <div className="w-2 h-2 bg-white/60 rounded-sm" />
              <div className="w-2 h-2 bg-white/60 rounded-sm" />
              <div className="w-2 h-2 bg-white rounded-sm" />
            </div>
          </div>
          
          <div className="relative text-left">
            <span className="block text-lg">掃描 QR 碼</span>
            <span className="block text-sm text-white/80">Scan QR Code</span>
          </div>
          
          {/* Camera icon */}
          <svg className="relative w-6 h-6 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Latest Scan Result */}
      {latestScan && (
        <div className="animate-slide-up bg-gradient-to-r from-[var(--color-success)]/20 to-[var(--color-primary-500)]/20 border border-[var(--color-success)]/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[var(--color-success)]/20 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--color-success)] mb-1">
                掃描成功 / Scan Successful
              </p>
              <div className="bg-[var(--color-surface)] rounded-lg p-3 break-all">
                <p className="text-sm text-slate-200 font-mono">{latestScan}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => copyToClipboard(latestScan)}
                  className="btn btn-secondary py-2 px-3 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  複製 / Copy
                </button>
                {isUrl(latestScan) && (
                  <a
                    href={latestScan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary py-2 px-3 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    開啟連結 / Open Link
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              掃描紀錄 / Scan History
            </h3>
            <button
              onClick={clearHistory}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              清除 / Clear
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {scanHistory.map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 bg-[var(--color-surface)] rounded-lg p-3 hover:bg-[var(--color-surface-lighter)] transition-colors"
              >
                <div className="w-8 h-8 bg-[var(--color-primary-500)]/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-[var(--color-primary-400)]">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate font-mono">{item.data}</p>
                  <p className="text-xs text-slate-500">
                    {item.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(item.data)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-[var(--color-surface-lighter)] rounded-lg transition-all"
                  title="Copy"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scanHistory.length === 0 && !latestScan && (
        <div className="text-center py-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--color-surface-lighter)] rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">
            尚無掃描紀錄<br />
            No scans yet
          </p>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

