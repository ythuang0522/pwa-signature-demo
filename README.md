# 電子簽名表單 PWA Demo

A Progressive Web App (PWA) demo featuring a digital signature form with handwritten signature capture (電子手寫簽名). Built with React, TypeScript, and Tailwind CSS.

![PWA Badge](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?logo=tailwindcss)

## ✨ Features

- **📝 Form Fields**: Name input, gender selection (Male/Female), 4-option checkbox group
- **✍️ Handwritten Signature**: Canvas-based signature capture supporting both touch and mouse
- **✅ Form Validation**: Real-time validation with bilingual error messages (中文/English)
- **💾 Auto-save Draft**: Automatically saves form data to localStorage
- **👁️ Preview Dialog**: Shows form summary with JSON output and signature preview
- **📱 Responsive Design**: Mobile-first RWD layout
- **🌙 Dark Theme**: Modern glassmorphism UI with gradient backgrounds
- **📲 PWA Support**: Installable, works offline, service worker caching

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ythuang0522/pwa-signature-demo.git
cd pwa-signature-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

The production files will be in the `dist/` folder.

## 📁 Project Structure

```
src/
├── components/
│   ├── FormCard.tsx        # Main form with all fields
│   ├── SignatureField.tsx  # Handwritten signature canvas
│   └── PreviewDialog.tsx   # JSON + signature preview modal
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── validation.ts       # Zod schema for form validation
│   └── storage.ts          # localStorage draft save/restore
├── App.tsx                 # Main layout
├── main.tsx                # Entry point
└── index.css               # Tailwind v4 + custom theme

public/
├── pwa-192x192.png         # PWA icon (192x192)
├── pwa-512x512.png         # PWA icon (512x512)
├── apple-touch-icon.png    # iOS icon
└── icon.svg                # Vector icon source
```

## 🖥️ Deployment

### Option 1: Static File Server (Apache/Nginx)

1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your web server
3. For Apache, the included `.htaccess` handles routing and caching

### Option 2: Local Testing with HTTPS via uvicorn + ngrok (Recommended for Development)

This project includes a `server.py` for quick local testing with HTTPS support (required for PWA features like service worker and install prompt).

#### Prerequisites
- Python with conda (miniforge3)
- ngrok installed (`brew install ngrok` or download from ngrok.com)

#### Quick Start (One Command)

**Terminal 1 - Start uvicorn server:**
```bash
source ~/miniforge3/bin/activate base && \
pip install uvicorn starlette --quiet && \
cd "/Users/ythuang/Desktop/Asia Pathogenomics/Programs/PWA" && \
uvicorn server:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Start ngrok tunnel:**
```bash
ngrok http 8000
```

#### What This Does
1. Activates the conda base environment
2. Installs uvicorn and starlette (if not already installed)
3. Serves the `dist/` folder at http://localhost:8000
4. ngrok provides an HTTPS URL (e.g., `https://xxxx.ngrok-free.app`) for testing PWA features on mobile devices

#### Development Workflow
```bash
# 1. Make changes to source code
# 2. Rebuild the app
npm run build

# 3. The uvicorn server automatically serves the new dist/ files
# 4. Refresh the ngrok URL in browser (may need to clear cache for PWA updates)
```

#### Troubleshooting PWA Cache on iOS
If the PWA on iPhone doesn't update after rebuild:
1. Delete the PWA from home screen
2. Clear Safari website data: Settings → Safari → Advanced → Website Data → Delete
3. Re-add the PWA from Safari

### Option 3: GitHub Pages

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Create `.github/workflows/deploy.yml` for automated deployment

## 🔧 Configuration

### PWA Manifest

Edit `vite.config.ts` to customize:
- App name and description
- Theme colors
- Icons

### Form Options

Edit `src/lib/types.ts` to modify the checkbox options:

```typescript
export const AVAILABLE_OPTIONS = [
  { id: "optionA", label: "選項 A / Option A" },
  { id: "optionB", label: "選項 B / Option B" },
  // Add or modify options here
] as const;
```

### Validation Rules

Edit `src/lib/validation.ts` to customize form validation with Zod.

## 📱 PWA Testing Checklist

| Feature | How to Test |
|---------|-------------|
| Install Prompt | Look for install icon in browser address bar |
| Offline Mode | DevTools → Network → Offline, then refresh |
| Service Worker | DevTools → Application → Service Workers |
| Manifest | DevTools → Application → Manifest |

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [react-hook-form](https://react-hook-form.com/) | Form handling |
| [Zod](https://zod.dev/) | Schema validation |
| [react-signature-canvas](https://github.com/agilgur5/react-signature-canvas) | Signature capture |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | PWA support |

## 📄 License

MIT License - feel free to use this for your own projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
