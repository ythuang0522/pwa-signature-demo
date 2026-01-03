import { FormCard } from "./components/FormCard";

function App() {
  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--color-primary-500)]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[var(--color-accent)]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary-500)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            電子簽名表單
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Digital Signature Form Demo
          </p>
        </header>

        {/* Main Form Card */}
        <main className="card animate-slide-up">
          <FormCard />
        </main>

        {/* Footer */}
        <footer className="text-center mt-8 text-xs text-slate-500 animate-fade-in">
          <p>
            PWA Demo • 支援離線使用 / Works Offline
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
