# NEXORA — PROJECT STATE

> Document de continuité du projet Nexora.
> Ce fichier constitue la référence rapide permettant de reprendre le développement dans une nouvelle session sans perdre l'état du projet.

---

## 1. IDENTITÉ DU PROJET

**Nom :** Nexora

**Vision :**
Construire un véritable **Agent AI**, et non simplement un chatbot.

Nexora doit progressivement être capable de :

* comprendre les messages ;
* identifier les intentions ;
* conserver une mémoire ;
* comprendre le contexte ;
* résoudre les références ;
* prendre des décisions ;
* enregistrer les exigences d'un projet ;
* raisonner sur ces informations ;
* utiliser ultérieurement des modèles d'IA/LLM ;
* évoluer vers un véritable système d'Agent AI.

### Principe fondamental

**Ne pas brûler les étapes.**

Chaque couche doit être construite, testée et validée avant de passer à la suivante.

---

# 2. STACK TECHNIQUE

## Backend

* NestJS
* TypeScript
* Prisma
* SQLite

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* App Router

## Base de données

SQLite via Prisma.

---

# 3. ARCHITECTURE BACKEND ACTUELLE

```text
backend/
└── src/
    ├── brain/
    │   ├── decisions/
    │   ├── intents/
    │   └── services/
    │
    ├── chat/
    │
    ├── context/
    │
    ├── memory/
    │
    ├── requirements/
    │
    ├── Prisma/
    │
    └── generated/
```

Architecture logique actuelle :

```text
Utilisateur
    │
    ▼
Chat
    │
    ▼
Brain
    │
    ├── Intent
    │
    ├── Context
    │
    ├── Decision
    │
    └── Action
    │
    ▼
Réponse Nexora
```

---

# 4. CHAT

Le système de chat est fonctionnel.

Endpoint principal :

```text
POST /chat
```

Le système accepte notamment :

```json
{
  "message": "Bonjour Nexora",
  "conversationId": 30
}
```

Le ChatService :

1. récupère ou crée une conversation ;
2. enregistre le message utilisateur ;
3. traite la mémoire ;
4. transmet le message au Brain ;
5. enregistre la réponse de Nexora ;
6. retourne l'historique.

Endpoint historique :

```text
GET /chat/history
```

---

# 5. MEMORY

Le système de mémoire utilisateur existe.

Modèle Prisma :

```prisma
model UserMemory {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

La mémoire permet notamment de conserver des informations comme :

```text
name
currentProject
```

Le Brain peut ensuite demander ces informations au MemoryService.

---

# 6. CONTEXT

Le système de contexte existe.

Le ContextService construit un contexte à partir de la conversation.

Le contexte peut notamment contenir :

```text
activeTopic
references
relevance
```

Exemple validé :

```text
Chrono Solar
```

comme sujet actif.

Le système est capable de comprendre :

```text
"Il doit être rapidement scalable"
```

et de résoudre :

```text
"il"
```

vers :

```text
Chrono Solar
```

---

# 7. INTENT SYSTEM

Le système d'intentions est fonctionnel.

Intentions actuellement définies :

```typescript
export enum BrainIntent {
  GREETING = 'GREETING',
  NEXORA_IDENTITY = 'NEXORA_IDENTITY',
  USER_NAME = 'USER_NAME',
  USER_PROJECT = 'USER_PROJECT',
  PROJECT_REQUIREMENT = 'PROJECT_REQUIREMENT',
  PROJECT_REQUIREMENTS_QUERY = 'PROJECT_REQUIREMENTS_QUERY',
  UNKNOWN = 'UNKNOWN',
}
```

Le système normalise les messages avant analyse.

Exemple :

```text
Il doit être rapidement scalable
```

devient approximativement :

```text
il doit etre rapidement scalable
```

L'intention détectée :

```text
PROJECT_REQUIREMENT
```

avec :

```text
confidence: 0.9
```

---

# 8. BRAIN DECISION SYSTEM

Le Brain possède maintenant un système de décision.

Actions disponibles :

```typescript
export enum BrainAction {
  ANSWER = 'ANSWER',
  CONTINUE_CONTEXT = 'CONTINUE_CONTEXT',
  ASK_CLARIFICATION = 'ASK_CLARIFICATION',
}
```

Principe :

```text
Intent
   │
   ▼
BrainDecisionService
   │
   ├── ANSWER
   ├── CONTINUE_CONTEXT
   └── ASK_CLARIFICATION
```

Une intention connue provoque actuellement :

```text
ANSWER
```

Une intention inconnue mais avec un contexte pertinent peut provoquer :

```text
CONTINUE_CONTEXT
```

Sinon :

```text
ASK_CLARIFICATION
```

---

# 9. PROJECT REQUIREMENTS

Le système de gestion des exigences de projet a été ajouté.

Modèle Prisma :

```prisma
model ProjectRequirement {
  id          Int      @id @default(autoincrement())
  project     String
  requirement String
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([project, requirement])
  @@index([project])
}
```

Le RequirementService permet notamment :

```text
addRequirement()
getRequirements()
requirementExists()
```

---

# 10. EXIGENCE VALIDÉE

Test effectué :

```text
Il doit être rapidement scalable
```

Contexte :

```text
Chrono Solar
```

Résultat du Brain :

```text
[INTENT] Intent:
PROJECT_REQUIREMENT

confidence:
0.9

[BRAIN] Decision:
PROJECT_REQUIREMENT

action:
ANSWER

topic:
Chrono Solar
```

Réponse obtenue :

```text
J'ai enregistré cette exigence pour "Chrono Solar" :
"doit être rapidement scalable".
```

L'exigence est désormais enregistrée dans la base de données.

---

# 11. QUERY DES EXIGENCES

Une intention supplémentaire a ensuite été ajoutée :

```text
PROJECT_REQUIREMENTS_QUERY
```

Test effectué :

```text
Quelles sont les exigences de Chrono Solar ?
```

Résultat validé :

```text
[INTENT]
PROJECT_REQUIREMENTS_QUERY

confidence:
0.95

[BRAIN] Decision:
PROJECT_REQUIREMENTS_QUERY

action:
ANSWER

topic:
Chrono Solar
```

Nexora retourne alors les exigences enregistrées pour le projet.

---

# 12. PRISMA — STRUCTURE ACTUELLE

La base contient actuellement :

```text
Conversation
Message
UserMemory
ProjectRequirement
```

Relations principales :

```text
Conversation
    │
    └── Messages

ProjectRequirement
    │
    └── Project
```

---

# 13. TESTS TECHNIQUES VALIDÉS

Le backend compile actuellement sans erreur.

Commande :

```powershell
npm run build
```

Résultat :

```text
0 error
```

Le serveur NestJS démarre correctement.

Port actuel :

```text
3001
```

Endpoint :

```text
http://localhost:3001/chat
```

---

# 14. PROBLÈME IMPORTANT RENCONTRÉ ET RÉSOLU

Un problème d'encodage Unicode a été rencontré avec les caractères accentués.

Exemple affiché dans certains logs :

```text
Il doit �tre rapidement scalable
```

Le système de normalisation a été renforcé afin de continuer à reconnaître correctement les intentions malgré ce problème.

Le test final a confirmé :

```text
PROJECT_REQUIREMENT
```

---

# 15. GIT

Branche actuelle :

```text
main
```

Dépôt distant :

```text
origin/main
```

Dernier état connu :

```text
working tree clean
```

Aucune modification non commitée au dernier contrôle.

---

# 16. ÉTAPES DÉJÀ RÉALISÉES

## Fondations

* [x] Création du projet Nexora
* [x] Configuration Git
* [x] Backend NestJS
* [x] Frontend Next.js
* [x] Communication frontend/backend
* [x] Chat de base
* [x] Conversations
* [x] Historique

## Mémoire

* [x] UserMemory
* [x] MemoryService
* [x] récupération des informations mémorisées

## Contexte

* [x] ContextService
* [x] activeTopic
* [x] références
* [x] résolution contextuelle

## Brain

* [x] IntentService
* [x] BrainIntent
* [x] BrainDecisionService
* [x] BrainAction
* [x] BrainService
* [x] système ANSWER / CONTINUE_CONTEXT / ASK_CLARIFICATION

## Requirements

* [x] Prisma ProjectRequirement
* [x] RequirementService
* [x] enregistrement d'une exigence
* [x] vérification d'existence
* [x] récupération des exigences
* [x] PROJECT_REQUIREMENT
* [x] PROJECT_REQUIREMENTS_QUERY

---

# 17. CE QUI N'EST PAS ENCORE FAIT

Les éléments suivants ne doivent PAS être considérés comme terminés.

## Reasoning

* [ ] système de raisonnement structuré
* [ ] décomposition des problèmes
* [ ] raisonnement multi-étapes
* [ ] dépendances entre exigences
* [ ] priorisation
* [ ] contradictions
* [ ] validation logique

## Intelligence

* [ ] intégration d'un LLM
* [ ] sélection du modèle
* [ ] système de prompts
* [ ] mémoire sémantique
* [ ] embeddings
* [ ] recherche vectorielle
* [ ] RAG
* [ ] outils utilisables par l'Agent

## Agent

* [ ] boucle Agent
* [ ] planification
* [ ] exécution d'actions
* [ ] observation des résultats
* [ ] correction
* [ ] autonomie contrôlée

## Frontend

* [ ] interface Nexora complète
* [ ] affichage avancé du raisonnement
* [ ] gestion des projets
* [ ] visualisation des exigences
* [ ] interface Agent
* [ ] système de notifications
* [ ] UX finale

## Sécurité

* [ ] authentification
* [ ] autorisation
* [ ] isolation des données utilisateur
* [ ] sécurité API
* [ ] gestion des secrets
* [ ] rate limiting
* [ ] logs de sécurité

## Production

* [ ] environnement production
* [ ] infrastructure
* [ ] monitoring
* [ ] sauvegardes
* [ ] tests automatisés
* [ ] CI/CD
* [ ] beta privée
* [ ] beta publique
* [ ] lancement

---

# 18. ORDRE DE DÉVELOPPEMENT

L'ordre doit rester progressif.

```text
FOUNDATION
    ↓
MEMORY
    ↓
CONTEXT
    ↓
INTENT
    ↓
DECISION
    ↓
REQUIREMENTS
    ↓
REASONING
    ↓
LLM
    ↓
TOOLS
    ↓
AGENT LOOP
    ↓
FRONTEND ADVANCED
    ↓
SECURITY
    ↓
TESTING
    ↓
PRIVATE BETA
    ↓
PUBLIC BETA
    ↓
PRODUCTION
```

---

# 19. RÈGLES DE DÉVELOPPEMENT NEXORA

## Règle 1

Ne pas brûler les étapes.

## Règle 2

Ne pas ajouter une technologie uniquement parce qu'elle est intéressante.

## Règle 3

Chaque nouvelle couche doit être testée avant d'ajouter la suivante.

## Règle 4

Une fonctionnalité validée ne doit pas être cassée par une nouvelle étape.

## Règle 5

Le code doit rester modulaire.

## Règle 6

Le Brain ne doit pas devenir un énorme fichier contenant toute l'intelligence.

## Règle 7

L'IA/LLM doit être introduite lorsque l'architecture est suffisamment prête à l'accueillir.

## Règle 8

Nexora doit évoluer vers un Agent AI véritable, pas simplement vers un chatbot avec un LLM.

---

# 20. PHILOSOPHIE DU PROJET

Nexora doit progressivement passer de :

```text
Chatbot
```

à :

```text
Assistant
```

puis :

```text
Copilote
```

puis :

```text
Agent
```

puis :

```text
Agent AI capable de comprendre,
raisonner, planifier et agir.
```

Chaque transition doit être construite sur la précédente.

---

# 21. PROCHAINE ÉTAPE

La prochaine grande étape est :

```text
REASONING ENGINE
```

Objectif :

Permettre à Nexora de ne plus seulement reconnaître une exigence, mais de commencer à **comprendre ses implications**.

Exemple :

```text
Utilisateur :
"Chrono Solar doit être rapidement scalable."

Nexora :
→ identifie l'exigence
→ identifie le projet
→ catégorise l'exigence
→ identifie les implications
→ identifie les éventuelles contraintes
→ identifie les décisions nécessaires
→ conserve ces informations
```

Cette étape doit être construite avant l'intégration complète d'un LLM.

---

# 22. ÉTAT ACTUEL

```text
NEXORA STATUS
=============

Backend             ✅
Frontend base       ✅
Chat                ✅
Memory              ✅
Context             ✅
Intent              ✅
Decision            ✅
Requirements        ✅
Requirement Query   ✅

Reasoning           ⏳
LLM                 ⏳
RAG                 ⏳
Tools               ⏳
Agent               ⏳
Advanced UI         ⏳
Security            ⏳
Testing             ⏳
Beta                ⏳
Production          ⏳
```

---

# 23. CONTINUITÉ DES SESSIONS

Si une nouvelle conversation est nécessaire, utiliser ce fichier comme référence principale.

Commande de reprise :

```text
On reprend Nexora.
Lis NEXORA_STATE.md.
Ne recommence aucune étape déjà marquée comme terminée.
Continue exactement à partir de la prochaine étape.
```

---

# 24. DERNIÈRE INSTRUCTION

**Ne jamais considérer une étape comme terminée uniquement parce que le code existe.**

Une étape est terminée lorsque :

```text
CODE
  ↓
BUILD
  ↓
TEST
  ↓
VALIDATION
  ↓
GIT COMMIT
  ↓
GIT PUSH
```

est validé.
