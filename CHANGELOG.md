# Changelog

## v1.0.3

- Licence propriétaire, non redistribuable, à acheteur unique (remplace MIT) : `LICENSE` et `package.json`.
- Contact par défaut `contact@` + domaine du site (`NEXT_PUBLIC_APP_URL`), plus d'adresse de démonstration ; expéditeur des e-mails : `EMAIL_FROM`, sinon l'adresse de contact des réglages.
- Couleur principale : les couleurs trop sombres sont refusées dans `/admin/settings` ; la couleur du navigateur mobile suit la couleur principale.
- Marque blanche vérifiée sur les pages publiques, client et administrateur, et dans les e-mails.

## v1.0.2

- Paiement : le nettoyage planifié ne supprime plus une réservation dont le paiement a abouti (webhook manquant ou en retard) ; il la confirme. Un paiement n'est plus jamais encaissé sans réservation.
- Annulation : impossible côté client une fois la location commencée, remboursement idempotent, confirmation avant annulation, reprise possible si la suppression échoue.
- Réservation : un nouvel essai pour le même véhicule et les mêmes dates remplace le précédent (le client ne se bloque plus lui-même), plafond de 5 paiements en attente par client.
- Prix : TVA exacte au centime (plus d'arrondi à l'euro), dates impossibles (30 février) refusées.
- Sécurité : redirection ouverte corrigée sur `/login`, rôle administrateur synchronisé avec `ADMIN_EMAILS`, garde administrateur sur chaque page `/admin`, envoi de photos limité à JPG, PNG et WebP côté serveur Cloudinary, option de lien de connexion dans les journaux supprimée, pool de connexions robuste (erreur inactive, délai de connexion).
- Seed : lit `.env` tout seul. Build Vercel : les aperçus ne migrent plus la base.
- E-mail d'agence : envoyé au premier administrateur tant que l'adresse de contact n'est pas configurée.
- Accessibilité : formules d'assurance en boutons radio, libellés, `aria-pressed`, dates du calendrier en français. Liens du pied de page par catégorie.
- Nettoyage : captures d'écran déplacées dans `docs/screenshots`, images d'exemple inutiles retirées, notices de licences complétées (polices), messages du webhook en français, `NEXT_PUBLIC_DEMO_MODE` à `false` par défaut.

## v1.0.1

- Sécurité : limite de débit partagée (paiement 10 requêtes/min/IP, demandes de connexion, santé approfondie), jeton cron accepté en `x-cron-secret` ou Bearer (comparaison à temps constant), erreurs du prestataire de paiement non exposées, aucun secret dans les journaux, en-tête HSTS.
- E-mails : `lib/email.ts` avec `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (ou `EMAIL_SERVER`) ; sans SMTP le site ne plante pas. Modèles de messages dans `lib/messages.ts`, nom et contact pris dans `/admin/settings`.
- Pages légales modifiables depuis `/admin/settings` (`/legal/mentions`, `/legal/cgv`, `/legal/confidentialite`) ; anciennes adresses redirigées.
- Pages 404 et 500 avec logo et bouton de retour (vrais statuts HTTP), `global-error.tsx`.
- `/api/health?deep=1` : base, Stripe, Cloudinary et SMTP vérifiés.
- Adresse publique (`NEXT_PUBLIC_APP_URL`) pour `robots.txt`, `sitemap.xml` et les métadonnées.
- Documentation : schéma de la base, routes de l'API, flux Véhicule → Réservation → Paiement, checklist de démonstration ; CI avec tests de bout en bout.

## v1.0.0 - Initial release

- Catalogue de véhicules en base de données, entièrement géré depuis `/admin/vehicles` (plusieurs photos par véhicule, envoi Cloudinary).
- Paramètres modifiables sans code depuis `/admin/settings` : identité, logo, couleur, textes d'accueil, tarifs, assurances, options, agences.
- Marque blanche : `config/branding.ts` et `config/content.ts`.
- Réservation avec calendrier de disponibilité, protection contre la double réservation et prix recalculé côté serveur.
- Paiement Stripe (PaymentIntent, webhook signé, remboursement à l'annulation).
- Nettoyage planifié des réservations impayées (`/api/cron/expire-pending`) et contrôle de santé (`/api/health`).
- Comptes clients (lien e-mail, Google), tableau de bord client et back-office des réservations.
- Interface en français, vue 3D optionnelle.
- E-mails de confirmation de réservation (client et agence), pages légales modifiables, pages 404 et erreur, `robots.txt`, `sitemap.xml`.
- Documentation d'architecture (schéma de base) et d'API.
- Next.js 15.5 et React 19 : aucune alerte critique à l'audit des dépendances.
- Base vide à l'installation : un administrateur et les réglages par défaut, aucun véhicule.
