# RentFleet

Plateforme de location de voitures en marque blanche : catalogue, calendrier de disponibilité, paiement en ligne Stripe, comptes clients, espace d'administration et vue 3D optionnelle.

**Stack :** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · NextAuth · Stripe · Cloudinary · Three.js

## Contenu du projet

- Le code source complet, prêt à déployer sur Vercel (ou tout hébergeur Node 20).
- Un catalogue **vide** : aucun faux véhicule, aucune fausse réservation, aucun compte de démonstration.
- Un back-office : réservations, véhicules (envoi de plusieurs photos), paramètres du site.
- Un paiement Stripe sécurisé (le prix est recalculé côté serveur, webhook signé) et une protection contre la double réservation.
- Des e-mails de confirmation (client et agence), les pages légales (mentions, conditions, confidentialité), `robots.txt` et `sitemap.xml`.
- Un point de contrôle `/api/health`, un nettoyage planifié des réservations impayées, la documentation (`docs/`) et une licence.

## Changer le nom, le logo et la couleur en 5 minutes (sans toucher au code)

1. Connectez-vous avec une adresse de `ADMIN_EMAILS`, puis ouvrez `/admin/settings`.
2. **Identité** : nom de l'application, slogan, e-mail de contact, ville par défaut.
3. **Logo** : collez une URL `https://…` ou envoyez un fichier (Cloudinary) ; l'aperçu se met à jour tout de suite.
4. **Couleur principale** : sélecteur ou code `#RRGGBB` ; boutons, liens et accents changent partout.
5. Enregistrez, puis rechargez `/` : le titre de l'onglet, la barre de navigation, le pied de page, les e-mails, la page 404 et `robots.txt` utilisent le nouveau nom.

Le même écran règle les textes de la page d'accueil, les tarifs (prix par défaut, frais de préparation, TVA), les assurances, les options, les agences et le texte des trois pages légales (`/legal/mentions`, `/legal/cgv`, `/legal/confidentialite`). Les véhicules se gèrent dans `/admin/vehicles`.
Valeurs de départ (avant la première sauvegarde) : `config/branding.ts` et `config/content.ts`.

## Installation en 5 minutes

Prérequis : Node.js 20 et une base PostgreSQL.

```bash
npm install                    # génère aussi le client Prisma
cp .env.example .env           # puis renseignez au minimum DATABASE_URL, NEXTAUTH_SECRET, ADMIN_EMAILS
npm run db:setup               # applique les migrations
SEED_ADMIN_EMAIL=vous@domaine.fr npm run db:seed   # crée l'administrateur et les réglages par défaut
npm run dev                    # http://localhost:3000
```

Connectez-vous avec l'adresse administrateur (en développement, le lien de connexion s'affiche dans la console), puis ouvrez `/admin/vehicles/new`.

## Variables d'environnement

Toutes sont décrites dans `.env.example`. Indispensables : `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAILS`, un moyen de connexion (SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`, ou Google). Pour payer : `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CURRENCY`. Pour envoyer des photos : `CLOUDINARY_*`. Pour le nettoyage planifié : `CRON_SECRET`. Facultatif : `NEXT_PUBLIC_APP_URL` (adresse publique utilisée par `robots.txt` et `sitemap.xml`).

### Vercel Env Variables

À coller dans Vercel > Settings > Environment Variables :

```
DATABASE_URL
NEXTAUTH_URL                          # https://votre-domaine.com
NEXTAUTH_SECRET
ADMIN_EMAILS
SMTP_HOST
SMTP_PORT                             # 587
SMTP_USER
SMTP_PASS
EMAIL_FROM
NEXT_PUBLIC_APP_URL                   # https://votre-domaine.com
GOOGLE_CLIENT_ID                      # optionnel
GOOGLE_CLIENT_SECRET                  # optionnel
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_CURRENCY                       # eur
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CRON_SECRET
NEXT_PUBLIC_DEMO_MODE                 # false
```

Guide pas à pas : [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Schéma de la base de données

```
User 1───* Reservation *───1 Car
 │ 1                           (vehicleId)
 ├──* Account       (comptes Google)
 └──* Session       (sessions de connexion)

VerificationToken   liens de connexion par e-mail (NextAuth)
Settings            une seule ligne "main" : identité, tarifs, assurances, options, agences, textes légaux

User         id, email (unique), name, role USER|ADMIN
Car          id, name, category, pricePerDay, image, images[], available, description
Reservation  id, userId, vehicleId, pickupDate, dropoffDate, days, insuranceId, addons,
             totalCents, status PENDING|CONFIRMED, paymentIntentId (unique), createdAt
```

Le détail des champs est dans `prisma/schema.prisma` et le diagramme complet dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Routes de l'API

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| GET | `/api/health` (`?deep=1`) | public | état de la base, de Stripe, du webhook, de Cloudinary et du SMTP |
| GET | `/api/cars` | public | catalogue, filtrable par dates |
| GET | `/api/cars/{id}/busy-dates` | public | dates déjà réservées d'un véhicule |
| POST | `/api/checkout` | connecté | crée la réservation en attente et le paiement (10 requêtes/min/IP) |
| DELETE | `/api/reservations/{id}` | propriétaire ou admin | annule et rembourse si payée |
| POST | `/api/webhooks/stripe` | signature Stripe | confirme ou libère la réservation |
| GET | `/api/cron/expire-pending` | `CRON_SECRET` | supprime les réservations impayées de plus de 30 minutes |
| POST / PUT / DELETE | `/api/admin/cars`, `/api/admin/cars/{id}` | admin | gestion des véhicules |
| PUT | `/api/admin/settings` | admin | réglages du site et textes légaux |
| POST | `/api/admin/upload-signature` | admin | signature d'envoi direct Cloudinary |
| * | `/api/auth/*` | public | connexion (NextAuth) |

Détail des corps et des codes d'erreur : [docs/API.md](docs/API.md).

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | serveur de développement |
| `npm run build` / `npm start` | build et serveur de production |
| `npm run db:setup` | `prisma migrate deploy` (jamais `migrate dev` en production) |
| `npm run db:seed` | administrateur + réglages par défaut, aucun véhicule |
| `npm run typecheck` / `npm run lint` | vérifications |
| `npm run update:check` | liste les dépendances à mettre à jour |

## Structure

```
app/            pages et routes API (admin/, api/, cars/, fleet/, dashboard/…)
components/     composants React (admin/ pour le back-office)
config/         branding.ts (identité) et content.ts (textes et options par défaut)
lib/            tarification, réservations, réglages, Stripe, validation
prisma/         schema.prisma, migrations, seed.ts
public/         logo, images neutres, captures d'écran
docs/           déploiement, architecture, API, vérification, maintenance
```

## Documentation

[Déploiement](docs/DEPLOYMENT.md) · [Architecture](docs/ARCHITECTURE.md) · [API](docs/API.md) · [Checklist de vérification](docs/VERIFICATION.md) · [Maintenance](docs/MAINTENANCE.md) · [Changelog](CHANGELOG.md) · [Licence](LICENSE)

## Licence

Logiciel propriétaire, non redistribuable, licence à acheteur unique : voir [LICENSE](LICENSE). Les composants open source gardent leur propre licence ([THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)).
