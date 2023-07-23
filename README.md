# Microservice

## Membres du Groupe

- **VOUVOU Brandon**
- **KEITA Lansana**
- **NDONG Erica**
- **FAUVET Laura**

## Description du projet et Fonctionnalités Implémentées

_Ce projet contient plusieurs microservices indépendants, réalisés en utilisant le framework NestJS avec Prisma comme ORM et l'architecture gRPC pour la communication inter-services._

### 1. Service User

_Ce service s'occupe principalement de la gestion d'un utilisateur, mise en place du modele, la configuration de la base de donnée_

### 2. Service Authentification

_L'authentification permet de gérer les différetes actions de connexion, déconnexion à l'aide d'un système de token._

### 3. Service Product

_Réprense le service qui s'occupe de la gestion d'un produit notamment la création, modification, suppression et lister._

### 4. Service Order

Le service s'occupe de la gestion de la commande en créant :

- Table order: pour stocker uniquement id de la commade
- Table orderProduct : qui stock l'id de la commande, id du produit commandé et sa quantité

### 5. Sécurité et SSL

_Pour renforcer la sécurité des échanges entre les microservices, nous avons mis en place la communication sécurisée via SSL (Secure Sockets Layer)._

## Démarrage

### Préparation avant de démarrer le microservice

- Exécutez `yarn install` ou simplement `yarn` à la racine de chaque microservice s'il n'y a pas de dossier **node_modules**

### Lancer l'application

- Allez à la racine de chaque microservuce dans l'espace de travail et exécutez la commande `yarn start`.
- Le serive User sera lancé à l'adresse suivante : http://localhost:3001
- Le serive Authentification sera lancé à l'adresse suivante : http://localhost:3002
- Le serive Product sera lancé à l'adresse suivante : http://localhost:3003
- Le serive Order sera lancé à l'adresse suivante : http://localhost:3004

## Propositions d’amélioration

- Interconnecté `User` et `Order` afin de pouvoir utiliser une relation pour vérifier si l'utilisateur existe et s'il est connecté avant de valider la commande.

- Interconnecté `Product` et `Order` afin de pouvoir utiliser une relation pour si le produit existe avant de valider la commande.

- Eventuellement mettre en place un service pour gérer le stock des produits en fonction des commandes

## Installation des dépendanses

```
- npm install
- npm i @nestjs/microservices @grpc/grpc-js @grpc/proto-loader
- npm i nestjs-grpc-reflection
```
