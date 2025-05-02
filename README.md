  # Plateforme Intelligente d'Évaluation Automatisée

## Accès à la plateforme en ligne
La plateforme est disponible sur : https://projet-base-de-donnees-avancees.vercel.app/

## 📋 Présentation

Notre apllicatio web est une plateforme web innovante qui révolutionne l'évaluation des travaux en bases de données pour les environnements académiques. Grâce à l'intégration de l'IA DeepSeek via Ollama, notre solution offre une correction automatisée des exercices, permettant aux enseignants de se concentrer sur l'accompagnement pédagogique plutôt que sur la correction répétitive.

## ✨ Fonctionnalités principales

### 👨‍🏫 Pour les professeurs
- **Gestion des sujets** : Création et publication d'exercices en format texte/PDF
- **Modèles de correction** : Possibilité d'ajouter plusieurs modèles de correction pour chaque exercice
- **Tableau de bord analytique** : Visualisation des statistiques de performance des étudiants
- **Ajustement des corrections** : Possibilité de réviser les notes générées par l'IA
- **Détection de plagiat** : Algorithmes avancés pour identifier les similitudes entre les soumissions

### 👨‍🎓 Pour les étudiants
- **Accès simplifié** : Authentification via OAuth2 (Google/Microsoft/GitHub)
- **Soumission intuitive** : Upload de fichiers PDF avec Drag & Drop
- **Feedback instantané** : Correction automatique avec notes et commentaires détaillés
- **Suivi de progression** : Graphiques d'évolution des performances

## 🛠️ Technologies utilisées

### Frontend
- **Framework** : React.js/Vue.js
- **Styling** : Tailwind CSS/Material UI
- **Data Visualization** : Recharts/Chart.js

### Backend
- **Framework** : Node.js (Express)
- **Base de données** : PostgreSQL via Supabase
- **IA** : DeepSeek via Ollama
- **Stockage** : Supabase storage

### Sécurité
- **Authentification** : OAuth2
- **Protection des données** : Chiffrement des fichiers soumis
- **Anti-plagiat** : Algorithmes de similarité (Jaccard, TF-IDF, NLP)

### Déploiement
- **FrontEnd** : Vercel (https://vercel.com/)
- **Backend** : Render (https://render.com/)

## 🔒 Sécurité et confidentialité

Notre plateforme met l'accent sur la protection des données des utilisateurs avec:
- Chiffrement des fichiers PDF soumis
- Authentification renforcée
- Séparation stricte des accès selon les rôles
- Détection automatique de plagiat pour garantir l'intégrité académique

## 📊 Architecture système

Notre architecture microservices permet une scalabilité optimale et une maintenance facilitée:
- Service d'authentification
- Service de correction automatique (IA)
- Service de stockage
- Service d'analyse et de statistiques

## 🚀 Installation et démarrage

```bash
# Cloner le dépôt
git clone https://github.com/DonaldEvlo/Projet_Base_De_Donnees_Avancees.git

# Installer les dépendances
npm install #pour le frontend
cd backend
npm install pour le backend

# Configuration environnement
cp .env.example .env
# Éditer le fichier .env avec vos paramètres

# Lancer l'application en développement
npm run dev #Pour l'api et le front end
npm run ia #dans le dossier backend pour lancer le serveur IA
```

## 📝 Contributeurs au projet
Ce projet a été réalisé par l'étroite collaboration entre les différents collaborateurs 



Développé avec ❤️ par [Touts les collaborateur] - Dans le cadre du projet de Plateforme Intelligente d'Évaluation Automatisée de base de données




