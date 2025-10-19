# NexCube Digital — Vite + React + TypeScript + Tailwind


Project scaffold untuk PT NexCube Digital. Ini adalah template landing / company site yang siap di-deploy ke Netlify.


## Setup (lokal)
1. Clone repo


```bash
git clone <your-repo-url>
cd nexcube-website
```


2. Install dependency


```bash
npm install
```


3. Jalankan development server


```bash
npm run dev
# buka http://localhost:5173
```


4. Build production


```bash
npm run build
npm run preview
```


## Deployment ke Netlify
- **Opsi A — Connect Git provider (disarankan)**
1. Push repo ke GitHub / GitLab.
2. Di Netlify: "New site from Git" → pilih repository → Build command: `npm run build` → Publish directory: `dist` → Deploy.


- **Opsi B — Drag & Drop**
1. Jalankan `npm run build`.
2. Unggah folder `dist/` ke Netlify (Deploys > Sites > Drag and drop your site output folder).


## Tips & next steps
- Tambahkan analytics, form backend (Netlify Functions / external service), dan CMS (e.g., Contentful / Sanity) bila perlu.
- Jika ingin domain kustom, atur domain di Netlify dan tambahkan DNS records.


```


---


## Notes / customization ideas
- Replace placeholder contact info with company's real data.
- Swap logos, add images under `src/assets` and import them into components.
- Add richer animations with Framer Motion or additional UI components.


---


Happy building! — Saya sudah menyiapkan project lengkap di canvas: buka file untuk melihat kode, salin ke repositori, dan deploy ke Netlify seperti di README.