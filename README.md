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

### Option 2: Local Testing with HTTPS (for PWA features)

```bash
# Install dependencies
pip install uvicorn starlette

# Activate conda environment (if using)
conda activate base

# Start the server
uvicorn server:app --host 0.0.0.0 --port 8000

# In another terminal, start ngrok for HTTPS
ngrok http 8000
```

Use the ngrok HTTPS URL to test PWA installation and offline features.

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
