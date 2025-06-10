# 🏆 LaufplanerPro - Triathlon Coach App

**Live Site:** [laufplanerpro.de](https://laufplanerpro.de)

## ⚠️ WICHTIG: Hosting Information

**DIESES PROJEKT WIRD BEI GITHUB PAGES GEHOSTET - NICHT BEI CLOUDFLARE PAGES!**

- ✅ **Aktuell**: GitHub Pages mit SvelteKit Static Adapter
- ❌ **Nicht**: Cloudflare Pages (wurde umgestellt)
- 🔗 **Domain**: laufplanerpro.de zeigt auf GitHub Pages
- 🛠️ **Adapter**: @sveltejs/adapter-static (nicht adapter-cloudflare)

## 🚀 Deployment Status

This app is configured for **GitHub Pages** deployment with automatic builds.

### Setup Instructions:

1. **Repository Settings** → **Pages**
2. **Source**: Select "**GitHub Actions**" 
3. The workflow will automatically build and deploy on every push to `main`

### Current Configuration:
- ✅ GitHub Actions workflow configured
- ✅ CNAME file set to `laufplanerpro.de`
- ✅ SvelteKit static adapter configured
- ✅ Build process working correctly

### If you see "starter" instead of the app:
- Check GitHub Pages source is set to "GitHub Actions"
- Wait for the workflow to complete (check Actions tab)
- DNS may need a few minutes to propagate

---

## Features

🧠 **AI-Powered Analytics** - Smart training recommendations  
📱 **Device Integration** - Strava, Garmin, Polar support  
🎯 **Training Plans** - Personalized triathlon coaching  
🔒 **Secure** - JWT authentication with Cloudflare D1  

Built with SvelteKit + TypeScript