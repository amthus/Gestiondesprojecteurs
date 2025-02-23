# Gestion des Projecteurs - ESGIS

Ce projet vise à développer une application backend en **Node.js** et **Express** pour la gestion des projecteurs à l'ESGIS. L'application permet aux utilisateurs de s'inscrire, se connecter, gérer les projecteurs et réserver des créneaux.

## Installation et Configuration

### 1. Création du projet
```sh
mkdir gestion-projecteurs && cd gestion-projecteurs
```

### 2. Initialisation de Node.js
```sh
npm init -y
```

### 3. Installation des dépendances
```sh
npm install express jsonwebtoken bcrypt dotenv sqlite3
```

### 4. Installation des dépendances de développement
```sh
npm install --save-dev nodemon eslint
```

### 5. Démarrage du serveur
```sh
npm run dev
```

---

## Fonctionnalités

### 1. Authentification et Gestion des Utilisateurs

- **Inscription (`POST /register`)** :
  - Récupération et hachage du mot de passe avec **bcrypt**.
  - Sauvegarde de l'utilisateur en base de données.
  - Retour d'un message de confirmation.

- **Connexion (`POST /login`)** :
  - Vérification de l'existence de l'utilisateur.
  - Comparaison du mot de passe avec **bcrypt**.
  - Génération et retour d'un token JWT.

---

### 2. Gestion des Projecteurs et Réservations

- **Routes CRUD pour les projecteurs** :
  - `POST /projectors` : Ajouter un projecteur.
  - `GET /projectors` : Lister les projecteurs disponibles.
  - `PUT /projectors/:id` : Modifier l'état d'un projecteur.
  - `DELETE /projectors/:id` : Supprimer un projecteur.

- **Gestion des réservations** :
  - `POST /reservations` : Réserver un projecteur.
  - `GET /reservations` : Lister les réservations.
  - `DELETE /reservations/:id` : Annuler une réservation.

---

### 3. Middleware, Rôles et Routes Protégées

- **Middleware d'authentification** :
  - Validation du token JWT et attachement de l'utilisateur à `req.user`.

- **Route Protégée (`GET /profile`)** :
  - Accès uniquement aux utilisateurs authentifiés.

- **Gestion des rôles** :
  - Attribution de rôles (Etudiant, Enseignant, Administrateur).
  - Restriction de certaines routes aux administrateurs.

- **Vérification des disponibilités** :
  - Empêcher la réservation si aucun projecteur n'est disponible.

---

## Tests et Validation

- Tester les routes avec **Postman** ou **cURL**.
- Respecter l'architecture **MVC**.
- Valider :
  - Inscription et connexion des utilisateurs.
  - Gestion des projecteurs (CRUD).
  - Gestion des réservations.
  - Protection des routes selon les rôles.

---