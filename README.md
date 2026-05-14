# DIT Library - Bibliothèque Numérique

Plateforme de gestion de bibliothèque académique avec système de recommandation IA.

## Technologies
- Backend : Node.js / Express
- Recommandation : Python / FastAPI / Scikit-learn
- Frontend : React.js
- Base de données : PostgreSQL
- Conteneurisation : Docker / Docker Compose
- Versioning données : DVC

## Lancement avec Docker Compose

### Mode développement
```bash
docker-compose --profile dev up -d
```

### Mode production
```bash
docker-compose --profile prod up -d
```

## URLs des services
- Frontend : http://localhost:3006
- Books API : http://localhost:3001
- Users API : http://localhost:3002
- Loans API : http://localhost:3003
- Recommendation API : http://localhost:8000

## Initialisation de la base de données
La base de données est automatiquement initialisée au premier démarrage via `init.sql`.

## Pipeline DVC

### Initialisation
```bash
dvc init
dvc remote add -d gdrive gdrive://11jlrGO9ly7FsWz-xv98p9EFLIjTVYzX4
```

### Reproduction du pipeline
```bash
dvc repro
```

### Afficher les métriques
```bash
dvc metrics show
```

### Comparer deux versions
```bash
dvc metrics diff HEAD~1
```

## Tests des endpoints

### Service Livres
```bash
# Lister les livres
curl http://localhost:3001/api/books

# Ajouter un livre
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code","author":"Robert Martin","isbn":"978-0132350884"}'

# Rechercher
curl http://localhost:3001/api/books/search?q=python
```

### Service Utilisateurs
```bash
# Lister les utilisateurs
curl http://localhost:3002/api/users

# Créer un utilisateur
curl -X POST http://localhost:3002/api/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Amadou","last_name":"Diallo","email":"amadou@dit.sn","user_type":"STUDENT"}'
```

### Service Emprunts
```bash
# Lister les emprunts
curl http://localhost:3003/api/loans

# Créer un emprunt
curl -X POST http://localhost:3003/api/loans \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"book_id":1}'

# Retourner un livre
curl -X PATCH http://localhost:3003/api/loans/1/return \
  -H "Content-Type: application/json" \
  -d '{"rating":5}'
```

### Service Recommandation
```bash
# Entrainer le modele
curl -X POST http://localhost:8000/train

# Obtenir des recommandations
curl http://localhost:8000/recommendations/1
```

## Structure du projet
```
dit-library/
├── services/
│   ├── books/          # Service Livres (Node.js)
│   ├── users/          # Service Utilisateurs (Node.js)
│   ├── loans/          # Service Emprunts (Node.js)
│   └── recommendation/ # Service Recommandation (Python/FastAPI)
├── frontend/           # Interface React
├── scripts/            # Scripts DVC
├── data/               # Données et métriques
├── init.sql            # Initialisation PostgreSQL
├── docker-compose.yml  # Orchestration Docker
└── dvc.yaml            # Pipeline DVC
```