# Donia · Back-office Admin

Application Next.js (App Router + TypeScript + Tailwind v4) qui héberge l'administration
de la plateforme Donia. Déployée sur `admin.doniia.com`.

## Stack

- Next.js 16.2.6 / React 19
- Tailwind CSS v4
- Fonts : Fraunces + Bricolage Grotesque
- Aucune dépendance d'auth ou de fetch pour l'instant — toutes les vues utilisent
  des données mockées en attendant le branchement aux endpoints `/v1/admin/*`.

## Routes

| URL | Vue |
|---|---|
| `/` | Page de connexion admin |
| `/dashboard` | KPIs, charts, activité en direct, alertes |
| `/cards` | Galerie des cartes cadeaux |
| `/designer` | Éditeur visuel de carte (3 panneaux) |
| `/users` | Liste utilisateurs + filtres KYC |
| `/transactions` | Journal transactions + statuts |
| `/kyc` | File d'attente KYC + panneau d'examen |
| `/settings` | Modèle économique, opérateurs, notifications, équipe |

## Développement

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Variables d'environnement (à venir)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL du backend Donia (Railway) pour les futures requêtes admin |

## Roadmap

- [ ] Auth admin réelle (login → JWT, cookie httpOnly)
- [ ] Endpoints backend `/v1/admin/{stats,users,kyc,transactions,cards,settings}`
- [ ] Vues branchées sur l'API
- [ ] CRUD cartes via Designer
- [ ] Export CSV des transactions / utilisateurs
