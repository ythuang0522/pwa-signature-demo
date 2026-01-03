Below is a **detailed, demo-frontend-only implementation plan** for a **React PWA** with **RWD** that includes:

1. A web form (Name + Male/Female + 4-option checkbox group)
2. **電子手寫簽名** (handwritten signature capture on mobile/desktop)

---

## 0) Scope and assumptions (demo frontend only)

* **No backend**: “Submit” will **preview JSON**, and optionally **save draft to localStorage**.
* Works on **mobile + desktop**. Signature supports **touch + mouse**.
* “Signature” is stored as a **PNG DataURL** (base64) for demo convenience.

---

## 1) Tech stack (recommended)

### Core

* **Vite + React + TypeScript** (fast dev/build; modern default for React apps)
* **RWD styling**: Tailwind CSS (or CSS Modules if you prefer)
* **Form state + validation**:

  * `react-hook-form` + `zod` (simple, scalable)

### PWA

* `vite-plugin-pwa` for manifest + service worker + precache/runtime caching ([GitHub][1])

### Signature

* `react-signature-canvas` (React wrapper) ([GitHub][2])

  * Internally uses `signature_pad`, a canvas-based smooth signature library that supports modern browsers and includes guidance for resize/HiDPI handling ([GitHub][3])

---

## 2) Project setup steps

1. Create project

   * `npm create vite@latest my-pwa-demo -- --template react-ts`
2. Install dependencies

   * UI/form: `react-hook-form zod @hookform/resolvers`
   * Signature: `react-signature-canvas`
   * PWA: `vite-plugin-pwa`
   * Styling (optional): `tailwindcss postcss autoprefixer`
3. Add Tailwind (if using) and define breakpoints (mobile-first).
4. Add PWA plugin config in `vite.config.ts` (details in section 6).

---

## 3) App structure (simple but “realistic”)

Suggested folders:

* `src/`

  * `app/`

    * `App.tsx` (layout + routes if needed)
  * `components/`

    * `FormCard.tsx`
    * `SignatureField.tsx`
    * `PreviewDialog.tsx`
  * `lib/`

    * `storage.ts` (save/load draft)
    * `types.ts`
    * `validation.ts` (zod schema)
  * `styles/`

    * `globals.css`

Single-page is enough for a demo. If you want more “app-like”, add `react-router` and make `/form` + `/preview`.

---

## 4) Data model and UI requirements

### Data model (TypeScript)

* `name: string`
* `gender: "male" | "female"`
* `options: string[]` (exactly from 4 allowed options)
* `signatureDataUrl: string` (PNG base64, empty when not signed)
* `updatedAt: number`

### UI labels (example; can be bilingual)

* Name: `Name` / `姓名`
* Gender: `Male` / `男`, `Female` / `女`
* Options: 4 checkboxes (example)

  * Option A, B, C, D (or your real labels)
* Signature: `Signature` / `電子手寫簽名`

---

## 5) Form implementation plan (React + RWD)

### 5.1 Layout (RWD)

Mobile-first card layout:

* On small screens: single column (labels stacked)
* On md+ screens: two-column grid for compact layout:

  * Left: Name + Gender + Options
  * Right: Signature area + actions

Use:

* `max-width` container, center align
* touch-friendly spacing (44px-ish tap targets)
* sticky bottom action bar on mobile (optional)

### 5.2 Form handling (react-hook-form)

* Controlled fields:

  * Text input for `name`
  * Radio group for `gender`
  * Checkbox group for the 4 options
* Validation (zod rules):

  * `name`: required, min length 1 (and optionally max length)
  * `gender`: required
  * `options`: at least 1 selected (or exactly N if you want)
  * `signatureDataUrl`: required (or optional if demo allows submit without signature)

### 5.3 Demo submission behavior

On “Submit”:

* Build a JSON object
* Show Preview Dialog with:

  * formatted JSON
  * signature image preview (render `<img src={signatureDataUrl} />`)
* Optional: save to localStorage as a “draft”

On “Reset”:

* Clear RHF fields
* Clear signature canvas
* Remove localStorage draft

---

## 6) Signature feature (電子手寫簽名) implementation plan

### 6.1 Component responsibilities: `SignatureField.tsx`

UI:

* A bordered canvas area with a light background
* Buttons:

  * `Clear` / `清除`
  * (Optional) `Undo` if you implement stroke history (not required for demo)
  * (Optional) pen thickness selector

Core behavior:

* Use `react-signature-canvas` to draw on a `<canvas>` ([GitHub][2])
* On stroke end:

  * Export signature as PNG DataURL: `getTrimmedCanvas().toDataURL("image/png")`
  * Set into form state: `setValue("signatureDataUrl", dataUrl)`
* If user clears:

  * `sigRef.clear()`
  * `setValue("signatureDataUrl", "")`

### 6.2 Mobile UX details (important)

* Prevent scroll while signing:

  * Apply CSS on canvas: `touch-action: none;`
* Handle high DPI and responsive sizing:

  * On container resize/orientation change:

    * read container width/height
    * resize canvas with devicePixelRatio scaling
    * (optional) restore existing strokes if you keep history
  * `signature_pad` docs explicitly mention handling resize and high DPI screens as a common concern ([GitHub][3])

### 6.3 Accessibility

* Canvas is not inherently accessible, so:

  * Provide a label “Signature” with instructions
  * Provide a fallback action: “Clear” and a status text “Signature captured” when DataURL exists

---

## 7) PWA requirements and configuration

### 7.1 Manifest (installability)

In `vite-plugin-pwa` config:

* `name`, `short_name`
* `start_url: "/"`, `scope: "/"`
* `display: "standalone"`
* `theme_color`, `background_color`
* Icons (192x192, 512x512 at least)

`vite-plugin-pwa` is designed as a Vite-friendly, low-friction way to add service worker + manifest ([GitHub][1])

### 7.2 Service worker caching strategy (demo-friendly)

* **Precache** built assets (handled by plugin/workbox defaults)
* Runtime caching:

  * HTML navigation fallback to `index.html`
  * Cache images/icons
* Offline behavior:

  * For demo: show the form page offline (works because it’s static)
  * If you want a nicer demo: add a simple offline page/notice

### 7.3 “Draft offline” (optional but impressive in a demo)

* Store form data (including signature DataURL) in localStorage/IndexedDB
* On app load:

  * If draft exists, offer “Restore draft?”

---

## 8) Testing checklist (what to verify)

### Functional

* Name input works and validates
* Gender radio selection works
* Exactly the 4 checkbox options appear; selection updates state
* Signature:

  * Draw with mouse and touch
  * Clear works
  * Exported image preview matches what was drawn
* Submit opens preview with JSON + signature image

### RWD

* iPhone-sized viewport: usable spacing, no horizontal scroll
* Tablet/desktop: two-column layout, signature area not squished
* Orientation change: signature canvas still works

### PWA

* Lighthouse PWA checks:

  * Manifest valid
  * Service worker registered
  * Install prompt works (on supported browsers)
* Offline mode:

  * Reload works offline after first load
