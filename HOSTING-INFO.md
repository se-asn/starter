# 🏠 Hosting Information - LaufplanerPro

## Aktuelle Konfiguration (Stand: Januar 2025)

### ✅ AKTUELL: GitHub Pages
- **Platform**: GitHub Pages
- **Repository**: serapath/starter
- **Adapter**: `@sveltejs/adapter-static` 
- **Build**: Automatisch via GitHub Actions
- **Domain**: laufplanerpro.de
- **SSL**: Automatisch via GitHub Pages

### ❌ NICHT MEHR: Cloudflare Pages
- Früher war das Projekt für Cloudflare Pages konfiguriert
- Wurde umgestellt auf GitHub Pages wegen einfacherer Verwaltung
- Cloudflare adapter wurde entfernt

## Warum GitHub Pages?

1. **Einfacher**: Direkter Push-to-Deploy Workflow
2. **Kostenlos**: Für öffentliche Repositories
3. **Zuverlässig**: Direkt von GitHub gehostet
4. **Automatisch**: GitHub Actions Handle Build & Deploy

## Deployment Prozess

```bash
git push origin main
# → GitHub Actions startet automatisch
# → SvelteKit Build mit Static Adapter
# → Deploy zu GitHub Pages
# → Verfügbar unter laufplanerpro.de
```

## Wichtige Dateien

- `svelte.config.js` - Static Adapter Konfiguration
- `.github/workflows/deploy.yml` - GitHub Actions Workflow
- `static/CNAME` - Domain Konfiguration
- `src/lib/client-auth.ts` - Client-seitige Auth (statt Server API)

## Bei Problemen

1. Check GitHub Repository Settings → Pages
2. Verify CNAME zeigt auf laufplanerpro.de
3. Check GitHub Actions für Build Errors
4. DNS Propagation kann 5-10 Minuten dauern

---

**Letzte Aktualisierung**: Januar 2025
**Status**: ✅ Funktionsfähig und Live
