# 🏋️ SvelteKit Training App

A clean, modern SvelteKit application deployed on Cloudflare Pages.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.16+ with TypeScript
- **Deployment**: Cloudflare Pages
- **Adapter**: @sveltejs/adapter-cloudflare
- **Build Tool**: Vite 6.3+

## 📦 Deployment

This project is configured for Cloudflare Pages deployment:

1. **Push to GitHub** (this repo)
2. **Connect to Cloudflare Pages**
3. **Build settings**:
   - Build command: `npm run build`
   - Build output directory: `.svelte-kit/cloudflare`

## 🏗️ Project Structure

```
src/
├── app.html          # HTML template
├── app.d.ts          # TypeScript definitions
├── lib/              # Shared components & utilities
│   └── index.ts
└── routes/           # File-based routing
    └── +page.svelte  # Homepage
```

## ⚙️ Configuration

- `svelte.config.js` - SvelteKit configuration with Cloudflare adapter
- `wrangler.toml` - Cloudflare Workers/Pages configuration
- `vite.config.ts` - Vite build tool configuration
- `tsconfig.json` - TypeScript configuration

## 🌟 Features

- ✅ **Clean Setup** - Minimal, focused codebase
- ✅ **TypeScript** - Full type safety
- ✅ **Cloudflare Ready** - Optimized for Pages deployment
- ✅ **Fast Builds** - Sub-second development builds
- ✅ **Modern Stack** - Latest SvelteKit & Vite

---

**Ready to build something amazing!** 🚀
