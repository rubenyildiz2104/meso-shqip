# Mëso Shqip — Albanian Dialect Learner (PWA)

Une application web progressive (PWA) épurée et moderne conçue pour apprendre l'albanais écrit (**Gheg** et **Tosk**) à partir des **152 phrases essentielles** du guide de conversation, 100% axée sur la lecture, la mémorisation et le rappel actif écrit.

---

## 🎯 Fonctionnalités Clés

1. **Double dialecte Albanais (Gheg & Tosk) :**
   - Basculez en un clic entre **Gheg** (Kosovo, Nord de l'Albanie, Macédoine) et **Tosk** (Albanais standard, Sud).
   - Mode comparatif direct pour observer comment la même idée s'écrit dans chaque dialecte.

2. **Méthode d'Apprentissage par Répétition Espacée (SRS / SM-2) :**
   - Progression progressive pour débutant :
     - **Étape 1 : Découverte** (Lecture attentive et imprégnation de la phrase écrite).
     - **Étape 2 : Reconnaissance** (Albanais écrit vers Français).
     - **Étape 3 : Production active** (Français vers Albanais écrit).
   - Intervalles de révision calculés automatiquement (1 jour, 3 jours, 7 jours, etc.).

3. **Bibliothèque Complète des 152 Phrases :**
   - Recherche instantanée multi-langue (Français, Gheg, Tosk).
   - Filtres par chapitres thématiques (Salutations, Voyages, Restaurant, Travail, etc.).
   - Système de favoris (étoile) pour marquer les phrases difficiles.

4. **Prêt pour Smartphone (PWA) :**
   - Design responsive optimisé pour mobile et tactile.
   - Fonctionne 100% hors-ligne via Service Worker.
   - Installable directement sur l'écran d'accueil de votre iPhone ou Android comme une vraie application.
   - **Export / Import de sauvegarde JSON** en un clic pour ne jamais perdre vos progrès ou les transférer d'un appareil à l'autre.

---

## 📂 Fichiers du Projet

- `albanian_phrasebook.json` : Le fichier JSON complet extrait du document (152 phrases avec id, français, gheg, tosk, catégorie et notes linguistiques).
- `src/data/albanian_phrasebook.json` : Le dataset intégré dans l'application web.
- `src/lib/srs.ts` : Algorithme de répétition espacée (SM-2) et gestion de la persistance (`localStorage`).
- `src/components/` : Interface utilisateur (Header, Flashcards, Bibliothèque, Modales de stats et d'explications dialectales).

---

## 🚀 Lancer l'Application en Local

Dans le terminal de votre projet :

```bash
# Lancer le serveur de développement
npm run dev
```

Ouvrez l'URL affichée (ex. `http://localhost:5173`) dans votre navigateur !

---

## 📱 Comment l'Installer sur son Téléphone

### Option A : Déploiement Gratuit en 1 Minute (Recommandé)
1. Téléversez le dossier sur **GitHub** ou glissez le dossier `dist/` sur **[Vercel](https://vercel.com)** ou **[Netlify](https://netlify.com)** (gratuit).
2. Ouvrez le lien obtenu sur **Safari (iPhone)** ou **Chrome (Android)**.
3. Appuyez sur **Partager** puis **« Sur l'écran d'accueil »**.
4. L'application s'ouvre en plein écran sans barre d'adresse et fonctionne même sans réseau !

### Option B : Accès direct en réseau local (Wi-Fi)
Si votre ordinateur et votre téléphone sont sur le même réseau Wi-Fi :
```bash
npm run dev -- --host
```
Tapez ensuite l'adresse IP affichée (ex: `http://192.168.1.XX:5173`) sur le navigateur de votre téléphone.
