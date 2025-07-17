# VS Code & Projekt Cache-Löschung Guide

## 1. VS Code komplett neustarten
```bash
# VS Code schließen und neu öffnen
# Cmd+Q zum vollständigen Beenden
# Dann VS Code neu starten
```

## 2. VS Code Workspace-Cache löschen
```bash
# Alle VS Code Fenster schließen
# Dann diesen Ordner löschen (falls vorhanden):
rm -rf "/Users/serdar/Library/Application Support/Code/User/workspaceStorage"
```

## 3. VS Code Extension Host Cache löschen
```bash
# Extension Host neustarten in VS Code:
# Cmd+Shift+P > "Developer: Restart Extension Host"
```

## 4. TypeScript Language Server neustarten
```bash
# In VS Code:
# Cmd+Shift+P > "TypeScript: Restart TS Server"
```

## 5. Projekt-spezifische Caches löschen
```bash
cd /Users/serdar/Desktop/laufplanerpro/starter

# Node modules und Lock-Dateien löschen
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# SvelteKit Build-Cache löschen
rm -rf .svelte-kit
rm -rf build
rm -rf dist

# Vite Cache löschen
rm -rf .vite
rm -rf node_modules/.vite

# Allgemeine Cache-Ordner löschen
rm -rf .cache
rm -rf .tmp
rm -rf .turbo
```

## 6. Node.js und npm Cache löschen
```bash
# npm Cache löschen
npm cache clean --force

# Node.js temporäre Dateien löschen
rm -rf ~/.npm/_cacache
```

## 7. VS Code Settings zurücksetzen (falls nötig)
```bash
# VS Code Workspace-Einstellungen löschen (Vorsicht!)
rm -rf .vscode/settings.json

# Oder nur TypeScript-spezifische Einstellungen zurücksetzen:
# In VS Code: Cmd+Shift+P > "Preferences: Open Workspace Settings (JSON)"
# Dann TypeScript-bezogene Einstellungen entfernen
```

## 8. Komplette Neuinstallation
```bash
cd /Users/serdar/Desktop/laufplanerpro/starter

# Alle Caches löschen (siehe oben)
rm -rf node_modules
rm -f package-lock.json

# Dependencies neu installieren
npm install

# SvelteKit neu synchronisieren
npm run sync

# TypeScript-Check durchführen
npm run check

# Projekt bauen
npm run build
```

## 9. macOS-spezifische Caches löschen
```bash
# VS Code spezifische Caches in macOS
rm -rf ~/Library/Caches/com.microsoft.VSCode*
rm -rf ~/Library/Saved\ Application\ State/com.microsoft.VSCode*

# Spotlight Index neu erstellen (falls Dateisuche Probleme macht)
sudo mdutil -E /
```

## 10. Debugging: VS Code Developer Tools
```bash
# In VS Code:
# Cmd+Shift+P > "Developer: Toggle Developer Tools"
# Console-Tab öffnen und nach Fehlern suchen
```

## Empfohlene Reihenfolge für vollständige Cache-Löschung:

1. VS Code schließen (Cmd+Q)
2. Terminal öffnen und Projekt-Caches löschen (Schritte 5-6)
3. VS Code neu starten
4. TypeScript Server neustarten (Schritt 4)
5. Extension Host neustarten (Schritt 3)
6. `npm run sync && npm run check && npm run build`

Wenn Probleme bestehen bleiben, alle Schritte in der Reihenfolge 1-8 ausführen.
