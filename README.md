# 🏆 User Management - Angular App

> **📌 Exercice technique**  
> Application de gestion d'utilisateurs avec **scroll infini, édition de profils et gestion avancée des erreurs**.

---

## 🚀 Introduction

Ce projet est une **application Angular** permettant de gérer une liste d’utilisateurs avec les fonctionnalités suivantes :

✅ **Scroll infini** : Chargement progressif des utilisateurs au fur et à mesure du défilement.  
✅ **Édition de profil** : Modification des informations utilisateur via une **modale**.  
✅ **Gestion des erreurs** : Simulation d'erreurs aléatoires (**20%**).  
✅ **Optimisation des performances** : Utilisation de **Angular Signals**, `MutationObserver`, et `IntersectionObserver`.  

---

## 📦 Technologies utilisées

| Technologie         | Utilisation |
|---------------------|-------------|
| **Angular 19**      | Framework principal |
| **Angular Signals** | Gestion efficace des états |
| **Angular Material** | UI moderne et fluide |
| **RxJS**           | Gestion des flux asynchrones |
| **Json-server**    | Simulation d'une API REST |
| **Faker.js**       | Génération de faux utilisateurs |

---

## 🛠 Installation et exécution

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/eroldmc/user-management.git
cd user-management
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Démarrer l'application et le serveur JSON  
💡 Une seule commande pour **tout lancer** 🚀 :

```bash
npm run start:full
```

📌 **Ce que fait cette commande :**
- Vérifie si le fichier `data/users.json` existe, sinon il le génère.
- Démarre **json-server** (`http://localhost:3000/users`).
- Lance **l'application Angular** (`http://localhost:4200`).

---

## 🚀 Optimisations et bonnes pratiques

✅ **Utilisation des Angular Signals** pour une gestion d'état réactive et performante.  
✅ **Lazy Loading** des modules et composants pour un chargement plus rapide.  
✅ **Réduction du DOM recalculé** grâce à `@for` au lieu de `*ngFor`.  
✅ **Code propre et modulaire** pour faciliter la maintenance et l'évolution du projet.  

---

## 🧪 Test unitaire

✅ **Couverture de tests unitaires** pour le composant principal `(user-list.component) `

```bash
npm run test
```

---

## 🔥 Scripts utiles

| Commande                 | Description |
|--------------------------|-------------|
| `npm run start:full`     | **Démarre** l’application + l'API (`json-server`) |
| `npm run generate:users` | Génère des utilisateurs fictifs (`data/users.json`) |
| `npm run start`          | Lancer **uniquement** l’application Angular |
| `npm run json-server`    | Lancer **uniquement** le serveur JSON |
