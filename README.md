# CareerFlow

CareerFlow est une plateforme de création, amélioration et gestion de documents professionnels et scolaires. Le MVP actuel vise à lancer une expérience solide autour de la création de CV, de l’aperçu temps réel et de l’export PDF.

## Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

## Démarrage rapide

1. Copier `.env.example` vers `.env`
2. Configurer `DATABASE_URL`
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. Démarrer le projet :
   ```bash
   npm run dev
   ```

## Structure principale
- `app/` : pages et routes
- `components/` : composants UI
- `prisma/` : schéma Prisma
- `lib/` : utilitaires et services

## MVP livré
- page d’accueil
- authentification UI de base
- dashboard utilisateur
- pages pricing
- base Prisma préparée
- structure de projet prête pour le développement

## Prochaine étape
- mise en place de l’authentification réelle
- création de formulaires de CV
- stockage en base PostgreSQL
- génération PDF
- abonnement Pro
