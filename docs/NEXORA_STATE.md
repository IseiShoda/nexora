# NEXORA — PROJECT STATE

> **Document de continuité du projet Nexora**
>
> Ce fichier constitue la source de vérité opérationnelle du projet.
> Toute nouvelle session de développement doit commencer par sa lecture afin de comprendre l'état réel du projet, les fonctionnalités déjà validées, l'architecture actuelle et la prochaine étape à réaliser.

---

# 1. IDENTITÉ DU PROJET

## Nom

**Nexora**

## Vision

Nexora n'a pas pour objectif de devenir simplement :

* un chatbot ;
* une interface autour d'un LLM ;
* un framework d'agents ;
* un simple assistant conversationnel.

L'objectif est de construire une :

> **Intelligence opérationnelle évolutive**

Nexora doit progressivement être capable de :

* comprendre ;
* mémoriser ;
* raisonner ;
* comprendre les objectifs ;
* décider ;
* planifier ;
* utiliser des outils ;
* agir ;
* observer les résultats ;
* évaluer ses actions ;
* apprendre de ses expériences ;
* améliorer ses stratégies ;
* évoluer avec le temps.

L'objectif final est une intelligence capable de transformer une demande en **compréhension → décision → plan → action → observation → évaluation → expérience → évolution**.

---

# 2. PHILOSOPHIE DU PROJET

Nexora doit être construit progressivement.

Le LLM ne constitue pas à lui seul le cerveau de Nexora.

L'architecture cognitive déterministe doit d'abord être capable de :

* comprendre le contexte ;
* identifier les intentions ;
* raisonner ;
* prendre une décision ;
* produire un plan d'exécution ;
* transmettre ce plan au système d'exécution.

Le LLM sera ensuite intégré comme une capacité cognitive supplémentaire.

Principe :

> **Le LLM doit servir l'intelligence de Nexora, et non remplacer son architecture cognitive.**

---

# 3. ARCHITECTURE CIBLE

Architecture cognitive finale visée :

```text
                    NEXORA
                       │
                       ▼
              ┌─────────────────┐
              │  Cognitive Core │
              └─────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
     Memory         Goals         Planning
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  Tool Engine
                       │
                       ▼
                  Action Engine
                       │
                       ▼
                  Observation
                       │
                       ▼
                  Evaluation
                       │
                       ▼
                  Experience
                       │
                       ▼
                  Evolution
                       │
                       └──────────────► Cognitive Core
```

---

# 4. ARCHITECTURE COGNITIVE ACTUELLE

La base actuellement construite suit cette logique :

```text
Utilisateur
     │
     ▼
   Chat
     │
     ▼
   Brain
     │
     ▼
Cognitive Core
     │
     ├── Context
     ├── Intent / Understanding
     ├── Reasoning
     ├── Decision
     └── Execution Plan
              │
              ▼
        BrainService
              │
              ▼
       Existing Handlers
              │
              ▼
        Réponse Nexora
```

Important :

**Brain n'est plus l'autorité cognitive principale.**

Le Cognitive Core détermine désormais :

* l'interprétation finale ;
* la décision ;
* la stratégie d'exécution ;
* l'autorité d'exécution.

Le Brain devient progressivement un **orchestrateur/exécuteur** des décisions produites par le Cognitive Core.

---

# 5. BOUCLE OPÉRATIONNELLE CIBLE

À terme :

```text
Cognitive Core
      ↓
Goal Engine
      ↓
Planning Engine
      ↓
Action Engine
      ↓
Observation
      ↓
Evaluation
      ↓
Experience
      ↓
Evolution
      ↓
Cognitive Core
```

Cette boucle constitue la direction stratégique du projet.

---

# 6. STACK TECHNIQUE

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

## Environnement

```text
Node.js : v24.19.0
npm    : v11.17.0
Git    : v2.55.0.windows.3
VS Code: v1.132.0
```

---

# 7. REPOSITORY

Repository GitHub :

```text
https://github.com/IseiShoda/nexora
```

Branche principale :

```text
main
```

Répertoire local :

```text
C:\Users\Isei Shôda\Desktop\nexora
```

Backend :

```text
C:\Users\Isei Shôda\Desktop\nexora\backend
```

Frontend :

```text
C:\Users\Isei Shôda\Desktop\nexora\frontend
```

---

# 8. COMMANDES PRINCIPALES

## Frontend

Depuis :

```text
frontend/
```

Commande :

```bash
npm run dev
```

URL :

```text
http://localhost:3000
```

## Backend

Depuis :

```text
backend/
```

Commande :

```bash
npm run start:dev
```

Port :

```text
3001
```

Endpoint principal :

```text
POST http://localhost:3001/chat
```

Historique :

```text
GET http://localhost:3001/chat/history
```

Build backend :

```bash
npm run build
```

---

# 9. STRUCTURE BACKEND ACTUELLE

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
    ├── reasoning/
    │
    └── core/
        └── cognitive/
            ├── cognitive-core.module.ts
            ├── cognitive-core.service.ts
            └── cognitive-core.types.ts
```

Le dossier :

```text
brain/decisions/
```

contient encore l'ancien système de décision sous forme **legacy/transitoire**.

Il n'est plus utilisé par l'autorité cognitive active.

Sa suppression définitive sera traitée lors de l'étape 7.4 après audit des références.

---

# 10. CHAT

## État

✅ Fonctionnel

Le système Chat permet actuellement :

* réception d'un message ;
* transmission au Brain ;
* traitement cognitif ;
* génération d'une réponse ;
* historique des conversations.

Endpoints actuellement fonctionnels :

```text
POST /chat
GET  /chat/history
```

---

# 11. MEMORY

## État

✅ Fonctionnel

La mémoire actuelle permet notamment de conserver des informations utilisateur.

Exemples :

```text
name
currentProject
```

La mémoire constitue actuellement une fondation.

Elle devra progressivement évoluer vers :

```text
Living Memory
```

capable de stocker :

* faits ;
* décisions ;
* expériences ;
* erreurs ;
* solutions ;
* stratégies ;
* compétences ;
* contexte ;
* objectifs ;
* connaissances.

---

# 12. CONTEXT

## État

✅ Fonctionnel

Le ContextService permet actuellement de reconstruire le contexte d'une conversation.

Il fournit notamment :

```typescript
{
  conversationId,
  messages,
  activeTopic,
  entities,
  references,
  relevance
}
```

Le système sait notamment :

* identifier le sujet actif ;
* récupérer les messages pertinents ;
* suivre les entités ;
* résoudre certaines références ;
* mesurer la pertinence du contexte.

Exemple validé :

```text
Chrono Solar doit supporter 100 000 utilisateurs.

↓

Il doit être rapidement scalable.
```

Le système comprend que :

```text
"il" → "Chrono Solar"
```

---

# 13. INTENT ENGINE

## État

✅ Fonctionnel

Enum actuelle :

```typescript
export enum BrainIntent {
  GREETING = 'GREETING',
  NEXORA_IDENTITY = 'NEXORA_IDENTITY',
  USER_NAME = 'USER_NAME',
  USER_PROJECT = 'USER_PROJECT',
  PROJECT_REQUIREMENT = 'PROJECT_REQUIREMENT',
  PROJECT_REQUIREMENTS_QUERY = 'PROJECT_REQUIREMENTS_QUERY',
  QUESTION = 'QUESTION',
  UNKNOWN = 'UNKNOWN',
}
```

Les intentions principales sont donc :

```text
GREETING
NEXORA_IDENTITY
USER_NAME
USER_PROJECT
PROJECT_REQUIREMENT
PROJECT_REQUIREMENTS_QUERY
QUESTION
UNKNOWN
```

Important :

Une question explicite peut initialement être classée :

```text
UNKNOWN
```

par IntentService.

Le Cognitive Core utilise ensuite le raisonnement pour corriger cette interprétation lorsque cela est nécessaire.

---

# 14. REASONING ENGINE

## État

✅ Fondation déterministe fonctionnelle

Le ReasoningService actuel constitue la première fondation du raisonnement de Nexora.

Signature :

```typescript
analyze(
  message: string,
  subject: string | null,
  context?: ConversationContext,
): ReasoningResult
```

Types actuellement reconnus :

```text
FACT
REQUIREMENT
GOAL
CONSTRAINT
DECISION
QUESTION
UNKNOWN
```

Résultat :

```text
subject
type
facts
inferences
unknowns
implications
dependencies
questions
```

Le raisonnement sait déjà identifier notamment :

* faits ;
* exigences ;
* objectifs ;
* contraintes ;
* questions ;
* implications ;
* dépendances ;
* inconnues.

---

# 15. LIMITES ACTUELLES DU REASONING

Le moteur de raisonnement actuel n'est pas encore le moteur de raisonnement complet de Nexora.

Fonctionnalités encore à construire :

* raisonnement multi-étapes ;
* décomposition de problèmes ;
* chaînes logiques complexes ;
* priorisation ;
* résolution de contradictions ;
* validation logique avancée ;
* raisonnement probabiliste ;
* raisonnement avec mémoire historique ;
* raisonnement stratégique ;
* raisonnement assisté par LLM.

Donc :

```text
Reasoning Foundation       ✅
Advanced Reasoning        ⏳
```

---

# 16. COGNITIVE CORE

## État

✅ Fonctionnel

Le Cognitive Core constitue désormais la couche cognitive centrale de Nexora.

Fichiers :

```text
backend/src/core/cognitive/
├── cognitive-core.module.ts
├── cognitive-core.service.ts
└── cognitive-core.types.ts
```

---

# 17. COGNITIVE INPUT

Le Cognitive Core reçoit :

```typescript
export interface CognitiveInput {
  message: string;
  conversationId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}
```

---

# 18. UNDERSTANDING

Le Cognitive Core produit une compréhension structurée :

```typescript
export interface Understanding {
  intent: string;
  confidence: number;
  subject?: string;
  entities: string[];
  references: string[];
  source?:
    | 'INTENT'
    | 'REASONING'
    | 'CONTEXT'
    | 'COGNITIVE';
}
```

La compréhension peut donc provenir de plusieurs niveaux :

```text
Intent
Reasoning
Context
Cognitive arbitration
```

---

# 19. COGNITIVE REASONING

Structure :

```typescript
export interface Reasoning {
  type?: string;
  facts: string[];
  inferences: string[];
  unknowns: string[];
  implications: string[];
  dependencies: string[];
  questions: string[];
}
```

Le Cognitive Core agrège donc les informations produites par le moteur de raisonnement.

---

# 20. DECISION

Le Cognitive Core possède maintenant son propre système de décision déterministe.

Actions :

```typescript
export type CognitiveAction =
  | 'ANSWER'
  | 'CONTINUE_CONTEXT'
  | 'ASK_CLARIFICATION';
```

Règles actuelles :

```text
QUESTION
    ↓
ANSWER

Intent connue
    ↓
ANSWER

UNKNOWN + contexte pertinent + sujet actif
    ↓
CONTINUE_CONTEXT

UNKNOWN sans contexte suffisant
    ↓
ASK_CLARIFICATION
```

Le système de décision n'est donc plus délégué au BrainDecisionService.

---

# 21. EXECUTION PLAN

Le Cognitive Core produit désormais un plan d'exécution structuré :

```typescript
export interface ExecutionPlan {
  action: CognitiveAction;
  strategy: CognitiveExecutionStrategy;
  authority: CognitiveExecutionAuthority;
  intent: string;
  confidence: number;
  reason: string;
}
```

Stratégies :

```typescript
export type CognitiveExecutionStrategy =
  | 'ANSWER_INTENT'
  | 'CONTINUE_CONTEXT'
  | 'ASK_CLARIFICATION'
  | 'ANSWER_QUESTION';
```

Autorités :

```typescript
export type CognitiveExecutionAuthority =
  | 'LEGACY_BRAIN'
  | 'COGNITIVE_CORE';
```

L'autorité actuelle est :

```text
COGNITIVE_CORE
```

---

# 22. TRANSFERT D'AUTORITÉ COGNITIVE

## Situation historique

Avant le Cognitive Core :

```text
Brain
 ↓
BrainDecisionService
 ↓
Action
```

## Situation actuelle

```text
Brain
 ↓
Cognitive Core
 ↓
Decision
 ↓
Execution Plan
 ↓
BrainService
 ↓
Handler
```

Le Cognitive Core est maintenant l'autorité officielle de décision et d'exécution cognitive.

Le Brain conserve temporairement les handlers historiques afin d'assurer la continuité du système.

---

# 23. BRAIN SERVICE

## État

✅ Adapté au Cognitive Core

BrainService :

* reçoit la demande ;
* appelle le Cognitive Core ;
* récupère l'ExecutionPlan ;
* exécute la stratégie décidée ;
* utilise les handlers existants ;
* retourne la réponse.

Le Brain n'a donc plus vocation à devenir le cerveau final de Nexora.

Son rôle évolue vers :

> **Orchestration et exécution des décisions cognitives.**

---

# 24. QUESTION HANDLING

Une question explicite est désormais capable de traverser correctement toute la chaîne cognitive.

Exemple :

```text
Pourquoi Chrono Solar doit-il supporter
100 000 utilisateurs tout en restant rapide ?
```

Traitement :

```text
IntentService
      ↓
UNKNOWN
      ↓
ReasoningService
      ↓
QUESTION
      ↓
Cognitive Core
      ↓
Final intent = QUESTION
      ↓
Decision = ANSWER
      ↓
Execution = ANSWER_QUESTION
      ↓
Authority = COGNITIVE_CORE
```

Ce comportement a été testé avec succès.

---

# 25. REQUIREMENTS ENGINE

## État

✅ Fonctionnel

Le système sait actuellement :

* détecter une exigence ;
* identifier le projet concerné ;
* normaliser certaines exigences ;
* détecter les doublons ;
* vérifier l'existence ;
* créer une nouvelle exigence ;
* journaliser les opérations.

Exemple :

```text
Chrono Solar doit supporter 100 000 utilisateurs.
```

Le système identifie notamment :

```text
Projet :
Chrono Solar

Exigence :
Chrono Solar doit supporter 100 000 utilisateurs.

Cible :
100 000 utilisateurs
```

---

# 26. REQUIREMENT QUERY

## État

✅ Fonctionnel

Nexora peut interroger les exigences enregistrées.

La fonctionnalité permet notamment de demander les exigences existantes associées à un projet.

---

# 27. DATABASE

Technologies :

```text
Prisma
SQLite
```

La base actuelle sert notamment à stocker les informations de conversation et les exigences du projet.

L'architecture de données devra évoluer progressivement avec :

* Living Memory ;
* Goals ;
* Plans ;
* Actions ;
* Observations ;
* Evaluations ;
* Experiences ;
* Strategies ;
* Skills.

---

# 28. FRONTEND

## État

✅ Fondation fonctionnelle

Technologies :

```text
Next.js
React
TypeScript
Tailwind CSS
App Router
```

Le frontend actuel permet de communiquer avec le backend.

URL :

```text
http://localhost:3000
```

Le dashboard de base est fonctionnel.

Les fonctionnalités avancées restent à construire.

---

# 29. TESTS VALIDÉS RÉCEMMENT

## Test 1 — Greeting

Message :

```text
Bonjour
```

Résultat :

```text
[COGNITIVE] Final intent: GREETING
[COGNITIVE] Decision: ANSWER
[COGNITIVE] Execution: ANSWER_INTENT
[COGNITIVE] Authority: COGNITIVE_CORE

[BRAIN] Execution authority: COGNITIVE_CORE
[BRAIN] Execution: ANSWER_INTENT
```

Résultat :

```text
PASS
```

---

## Test 2 — Requirement

Message :

```text
Chrono Solar doit supporter 100 000 utilisateurs.
```

Résultat :

```text
[COGNITIVE] Final intent: PROJECT_REQUIREMENT
[COGNITIVE] Decision: ANSWER
[COGNITIVE] Execution: ANSWER_INTENT
[COGNITIVE] Authority: COGNITIVE_CORE

[BRAIN] Execution authority: COGNITIVE_CORE
[BRAIN] Execution: ANSWER_INTENT
```

Le système identifie également :

```text
Scalabilité
Architecture
Infrastructure
Base de données
Capacity Planning
```

Résultat :

```text
PASS
```

---

## Test 3 — Question

Message :

```text
Pourquoi Chrono Solar doit-il supporter
100 000 utilisateurs tout en restant rapide ?
```

Résultat :

```text
[COGNITIVE] Initial intent: UNKNOWN
[COGNITIVE] Reasoning overrides UNKNOWN → QUESTION
[COGNITIVE] Final intent: QUESTION
[COGNITIVE] Decision: ANSWER
[COGNITIVE] Execution: ANSWER_QUESTION
[COGNITIVE] Authority: COGNITIVE_CORE
```

Puis :

```text
[BRAIN] Execution Plan:
{
  action: 'ANSWER',
  strategy: 'ANSWER_QUESTION',
  authority: 'COGNITIVE_CORE',
  intent: 'QUESTION',
  confidence: 0.95,
  reason: 'Le raisonnement a identifié une question explicite.'
}
```

Résultat :

```text
PASS
```

---

# 30. BRAIN DECISION SERVICE — ÉTAT ACTUEL

Le système historique :

```text
BrainDecisionService
BrainDecisionModule
```

n'est plus l'autorité de décision.

Il est actuellement considéré comme :

```text
LEGACY / TRANSITION
```

Le Cognitive Core a repris la responsabilité de :

```text
Decision
Execution Authority
Execution Strategy
```

À l'étape 7.3 :

```text
BrainDecisionModule
```

a été retiré des imports actifs de :

```text
BrainModule
```

Les fichiers legacy restent temporairement présents afin d'effectuer un audit propre avant suppression définitive.

---

# 31. ÉTAPES COGNITIVE CORE RÉALISÉES

## Étape 7.1

Objectif :

> Promouvoir le Cognitive Core comme autorité d'exécution.

Résultat :

```text
ExecutionPlan.authority = COGNITIVE_CORE
```

Commit :

```text
62e18db feat: promote cognitive core as execution authority
```

Statut :

```text
VALIDÉ
```

---

## Étape 7.2

Objectif :

> Déplacer l'autorité de décision déterministe dans le Cognitive Core.

Résultat :

* suppression de la dépendance Cognitive Core → BrainDecisionService ;
* décision déterministe intégrée dans Cognitive Core ;
* BrainDecisionService retiré du chemin cognitif actif.

Commit :

```text
7d46571 refactor: move decision authority into cognitive core
```

Statut :

```text
VALIDÉ
```

---

## Étape 7.3

Objectif :

> Retirer BrainDecisionModule du BrainModule.

Résultat :

```text
BrainModule
```

ne dépend plus de :

```text
BrainDecisionModule
```

Les tests runtime ont été validés.

Le repository a également été vérifié proprement :

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Statut :

```text
VALIDÉ
```

---

# 32. PROCHAINE ÉTAPE

## Étape 7.4 — Legacy Decision Audit & Removal

Objectif :

Auditer complètement les références restantes à :

```text
BrainDecisionService
BrainDecisionModule
```

Avant suppression.

Actions prévues :

1. rechercher toutes les références ;
2. vérifier les imports ;
3. vérifier les injections ;
4. vérifier les tests ;
5. vérifier les providers ;
6. vérifier les exports ;
7. vérifier les modules ;
8. supprimer uniquement ce qui n'est plus nécessaire ;
9. lancer le build ;
10. lancer les tests ;
11. valider le runtime ;
12. commit ;
13. push ;
14. mettre à jour ce fichier.

Fichiers potentiellement concernés :

```text
backend/src/brain/decisions/brain-decision.service.ts
backend/src/brain/decisions/brain-decision.module.ts
```

Important :

> **Ne pas supprimer les fichiers avant l'audit des références.**

---

# 33. CE QUI N'EST PAS ENCORE CONSTRUIT

## Cognitive

* raisonnement multi-étapes ;
* raisonnement stratégique avancé ;
* contradictions ;
* priorisation ;
* validation logique avancée ;
* raisonnement LLM assisté.

## Memory

* Living Memory complète ;
* mémoire sémantique ;
* embeddings ;
* vector store ;
* mémoire d'expérience ;
* mémoire de stratégies.

## Intelligence

* LLM ;
* RAG ;
* connaissances externes ;
* apprentissage à partir d'expériences.

## Goals

* Goal Engine ;
* objectifs court terme ;
* objectifs moyen terme ;
* objectifs long terme ;
* suivi d'avancement.

## Planning

* Planning Engine ;
* décomposition d'objectifs ;
* dépendances de tâches ;
* priorités ;
* plan multi-étapes.

## Tools

* Tool Engine ;
* catalogue d'outils ;
* sélection d'outils ;
* exécution d'outils ;
* validation des résultats.

## Action

* Action Engine ;
* exécution autonome ;
* gestion des erreurs ;
* retry ;
* rollback.

## Agent Loop

* observation ;
* évaluation ;
* expérience ;
* évolution.

## Frontend

* dashboard avancé ;
* visualisation de mémoire ;
* visualisation des objectifs ;
* visualisation des plans ;
* visualisation des actions ;
* monitoring cognitif.

## Production

* sécurité avancée ;
* tests automatisés complets ;
* observabilité ;
* monitoring ;
* gestion des erreurs ;
* private beta ;
* public beta ;
* production.

---

# 34. ARCHITECTURE CIBLE COMPLÈTE

```text
                       UTILISATEUR
                            │
                            ▼
                          CHAT
                            │
                            ▼
                          BRAIN
                            │
                            ▼
                    ┌─────────────────┐
                    │  COGNITIVE CORE │
                    └─────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
     CONTEXT              MEMORY              GOALS
        │                   │                   │
        ▼                   ▼                   ▼
   UNDERSTANDING       KNOWLEDGE          GOAL ENGINE
        │
        ▼
    REASONING
        │
        ▼
     DECISION
        │
        ▼
 EXECUTION PLAN
        │
        ▼
 PLANNING ENGINE
        │
        ▼
  ACTION ENGINE
        │
        ▼
   TOOL ENGINE
        │
        ▼
    OBSERVATION
        │
        ▼
    EVALUATION
        │
        ▼
    EXPERIENCE
        │
        ▼
     EVOLUTION
        │
        └──────────────────────► COGNITIVE CORE
```

---

# 35. ORDRE DE DÉVELOPPEMENT

Ordre officiel actuel :

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
COGNITIVE CORE
      ↓
LLM
      ↓
TOOLS
      ↓
GOAL ENGINE
      ↓
PLANNING ENGINE
      ↓
ACTION ENGINE
      ↓
AGENT LOOP
      ↓
OBSERVATION
      ↓
EVALUATION
      ↓
EXPERIENCE
      ↓
EVOLUTION
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

Cet ordre peut évoluer uniquement après validation technique et mise à jour de ce fichier.

---

# 36. ÉTAT GLOBAL ACTUEL

```text
Backend              ✅
Frontend Base        ✅
Chat                 ✅
Memory               ✅
Context              ✅
Intent               ✅
Requirements         ✅
Requirement Query    ✅

Reasoning Foundation ✅
Cognitive Core       ✅
Decision Authority   ✅
Execution Plan       ✅

Advanced Reasoning   ⏳
LLM                  ⏳
Semantic Memory      ⏳
Embeddings           ⏳
RAG                  ⏳
Tools                ⏳
Goal Engine          ⏳
Planning Engine      ⏳
Action Engine        ⏳
Agent Loop           ⏳
Observation          ⏳
Evaluation           ⏳
Experience           ⏳
Evolution            ⏳

Advanced UI          ⏳
Security             ⏳
Automated Testing    ⏳
Private Beta         ⏳
Public Beta          ⏳
Production           ⏳
```

---

# 37. DÉFINITION DE "TERMINÉ"

Une fonctionnalité ne doit jamais être considérée comme terminée uniquement parce que le code compile.

Une étape est considérée comme terminée uniquement après :

```text
CODE
 ↓
BUILD
 ↓
TEST
 ↓
RUNTIME VALIDATION
 ↓
VALIDATION
 ↓
GIT COMMIT
 ↓
GIT PUSH
 ↓
NEXORA_STATE.md UPDATE
```

---

# 38. RÈGLES DE DÉVELOPPEMENT

## Règle 1 — Pas de saut d'étape

Ne pas construire une couche avancée avant d'avoir stabilisé ses dépendances.

## Règle 2 — Pas de code non testé

Chaque modification importante doit être compilée et testée.

## Règle 3 — Pas de régression

Une nouvelle fonctionnalité ne doit pas casser :

* Chat ;
* Memory ;
* Context ;
* Intent ;
* Requirements ;
* Reasoning ;
* Cognitive Core.

## Règle 4 — Architecture avant complexité

Ne pas ajouter inutilement des couches ou dépendances.

## Règle 5 — Le LLM n'est pas le cerveau complet

Le LLM doit être intégré dans l'architecture cognitive, pas remplacer cette architecture.

## Règle 6 — Source de vérité

`NEXORA_STATE.md` doit refléter l'état réel du repository.

## Règle 7 — Git

Après chaque étape validée :

```bash
git status
git add .
git commit -m "message"
git push
```

Puis vérifier :

```bash
git status
```

Résultat attendu :

```text
nothing to commit, working tree clean
```

---

# 39. RÈGLE DE CONTINUITÉ

Lorsqu'une nouvelle session commence :

1. lire `NEXORA_STATE.md` ;
2. identifier la dernière étape validée ;
3. vérifier le repository ;
4. vérifier le code actuel ;
5. ne pas reconstruire ce qui existe déjà ;
6. ne pas considérer une fonctionnalité comme terminée sans preuve ;
7. continuer exactement depuis la prochaine étape.

---

# 40. SITUATION ACTUELLE

Nexora possède désormais une première architecture cognitive fonctionnelle.

La chaîne actuelle est :

```text
Message
   ↓
Context
   ↓
Intent
   ↓
Reasoning
   ↓
Cognitive Understanding
   ↓
Cognitive Decision
   ↓
Execution Plan
   ↓
Brain Execution
   ↓
Response
```

Le point architectural majeur actuellement validé est :

> **Le Cognitive Core est désormais l'autorité cognitive de Nexora.**

Le Brain n'est plus destiné à porter la logique décisionnelle principale.

La prochaine étape consiste à nettoyer définitivement l'ancien système de décision après audit.

---

# 41. PROCHAINE ACTION OFFICIELLE

```text
STEP 7.4

LEGACY DECISION AUDIT & REMOVAL
```

Objectif immédiat :

```text
BrainDecisionService
BrainDecisionModule
        ↓
AUDIT
        ↓
REMOVE LEGACY
        ↓
BUILD
        ↓
TEST
        ↓
RUNTIME VALIDATION
        ↓
COMMIT
        ↓
PUSH
        ↓
UPDATE STATE
```

---

# 42. PHILOSOPHIE FINALE

Nexora n'est pas construit pour simplement répondre à des messages.

Nexora est construit pour progressivement :

```text
COMPRENDRE
    ↓
RAISONNER
    ↓
DÉCIDER
    ↓
PLANIFIER
    ↓
AGIR
    ↓
OBSERVER
    ↓
ÉVALUER
    ↓
APPRENDRE
    ↓
ÉVOLUER
```

La finalité est une intelligence opérationnelle capable de transformer progressivement ses capacités, ses expériences et ses connaissances en stratégies d'action toujours plus efficaces.

> **Nexora doit devenir l'évolution finale d'un Agent.**

---

# 43. DERNIÈRE VALIDATION CONNUE

Dernier état repository connu :

```text
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Dernier commit explicitement identifié dans l'historique de travail :

```text
7d46571 refactor: move decision authority into cognitive core
```

Étapes Cognitive Core validées :

```text
7.1 ✅
7.2 ✅
7.3 ✅
```

Prochaine étape :

```text
7.4 ⏳
Legacy Decision Audit & Removal
```

---

# FIN DE NEXORA_STATE.md
