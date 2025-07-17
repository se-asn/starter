# 📋 Supabase Setup Checkliste

## ✅ Supabase.com Setup:

### **1. Projekt erstellen** (5 Min)
- [x] ✅ Bei supabase.com anmelden
- [x] ✅ "New project" → Name: `laufplanerpro`
- [x] ✅ Region: `Central EU (Germany)`
- [x] ✅ Plan: `Free`
- [x] ✅ Warten bis Projekt bereit ist

### **2. API Keys kopieren** (2 Min)
- [x] ✅ Settings → API
- [x] ✅ **Project URL** kopieren: `https://ncmfcwknvxoirlmniraq.supabase.co`
- [x] ✅ **anon public** Key kopieren
- [x] ✅ **service_role** Key kopieren

### **3. Datenbank Schema** (3 Min)
- [ ] SQL Editor → New query
- [ ] Inhalt von `supabase-schema.sql` einfügen und ausführen
- [ ] ✅ Erfolgreich ausgeführt (alle Tabellen erstellt)

### **4. Authentication Settings** (1 Min)
- [ ] Authentication → Settings
- [ ] Email confirmations: `OFF` (für Entwicklung)
- [ ] Custom SMTP: `OFF` (Standard Email)

## ✅ Cloudflare Pages Setup:

### **5. Environment Variables** (3 Min)
In Cloudflare Dashboard → Pages → Ihr Projekt → Settings → Environment variables:

- [ ] `PUBLIC_SUPABASE_URL` = `https://xyz.supabase.co`
- [ ] `PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGc...`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGc...`

### **6. Build Settings überprüfen**
- [ ] Build command: `npm run build`
- [ ] Build output directory: `build`
- [ ] Root directory: `starter` (falls nötig)

## ✅ Testing:

### **7. Lokaler Test** (2 Min)
```bash
# ✅ .env.local bereits erstellt mit den Supabase Keys
# ✅ Website läuft bereits auf http://localhost:5173
```
**Status: ✅ LÄUFT BEREITS!** 🎉

### **8. Cloudflare Deploy**
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
# → Cloudflare baut automatisch
```

## 🎯 Nach dem Setup:

### **Testen Sie:**
1. **Registrierung:** Neuen Account erstellen
2. **Login:** Mit Account anmelden  
3. **Datenbank:** Profil anschauen
4. **API:** Strava-Integration testen

### **Überwachen Sie:**
- **Supabase Dashboard:** Database, Auth, Logs
- **Cloudflare Analytics:** Traffic, Performance
- **GitHub:** Successful deployments

## 📞 Bei Problemen:

1. **Supabase Logs:** Database → Logs
2. **Cloudflare Logs:** Pages → Functions → View details
3. **Browser Console:** F12 → Console für Fehler

## 🚀 Fertig!

Ihr LaufplanerPro läuft jetzt mit:
- ✅ Cloudflare Pages (Hosting)
- ✅ Supabase (Database + Auth)  
- ✅ GitHub (Code Repository)
- ✅ 100% kostenlos bis 50k DB-Zeilen

**Nächster Schritt:** Frontend-Integration testen! 🎉
