# 🚀 Vercel Deployment Setup Guide

## Steg 1: Skapa Vercel Konto och Projekt

1. **Gå till [vercel.com](https://vercel.com)** och logga in med GitHub
2. **Importera ditt GitHub repo** (SimpleCryptoTool)
3. **Konfigurera projekt**:
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

## Steg 2: Hämta Vercel Tokens och IDs

### A. Installera Vercel CLI
```bash
npm i -g vercel
vercel login
```

### B. Hämta Project ID och Org ID
```bash
cd /path/to/SimpleCryptoTool
vercel link
```

Detta skapar `.vercel/project.json` med:
```json
{
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxxxxxxxxx"
}
```

### C. Skapa Vercel Token
1. Gå till [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Klicka **"Create Token"**
3. Namnge den: `GitHub Actions CI/CD`
4. Kopiera token (visas bara en gång!)

## Steg 3: Lägg till GitHub Secrets

Gå till ditt GitHub repo → **Settings** → **Secrets and variables** → **Actions**

Lägg till dessa secrets:

| Secret Name | Value | Beskrivning |
|-------------|-------|-------------|
| `VERCEL_TOKEN` | `vercel_token_här` | Token från steg 2C |
| `VERCEL_ORG_ID` | `team_xxxxx` | Från .vercel/project.json |
| `VERCEL_PROJECT_ID` | `prj_xxxxx` | Från .vercel/project.json |

## Steg 4: Testa Deployment

När du pushar till `main` branch kommer GitHub Actions automatiskt att:

1. ✅ Köra alla tester
2. ✅ Bygga applikationen  
3. ✅ Deploya till Vercel
4. ✅ Ge dig en live URL

## Steg 5: Konfigurera Domän (Valfritt)

1. I Vercel dashboard → **Settings** → **Domains**
2. Lägg till din egen domän
3. Följ DNS-instruktionerna

## Environment Variables

Om du behöver environment variables i produktion:

1. Vercel Dashboard → **Settings** → **Environment Variables**
2. Lägg till:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_APP_URL=https://din-app.vercel.app`
   - Eventuella API keys

## Troubleshooting

### Problem: Build Failed
- Kolla build logs i Vercel dashboard
- Se till att alla dependencies finns i package.json
- Kontrollera TypeScript errors

### Problem: Deployment Failed
- Verifiera att VERCEL_TOKEN är korrekt
- Kontrollera att ORG_ID och PROJECT_ID matchar

### Problem: 404 på deployment
- Kontrollera att Next.js routing är korrekt konfigurerad
- Se till att alla pages finns i `app/` mappen

## Nästa Steg

Efter lyckad deployment:
- ✅ Konfigurera custom domain
- ✅ Sätt upp monitoring (Sentry)
- ✅ Lägg till performance tracking
- ✅ Konfigurera analytics
