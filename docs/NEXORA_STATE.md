# NEXORA — ÉTAT DU PROJET

**Projet :** Nexora
**Description :** The Intelligent Business Operating System
**Dépôt GitHub :** IseiShoda/nexora
**Branche principale :** `main`
**Stack Backend :** NestJS + TypeScript + Prisma + SQLite
**Stack Frontend :** Next.js + React + TypeScript + Tailwind CSS
**Dernière mise à jour :** Septembre 2026

---

# 1. VISION DU PROJET

Nexora n'a pas pour objectif de devenir simplement :

* un chatbot ;
* un assistant conversationnel ;
* un framework d'agents ;
* un wrapper autour d'un LLM ;
* un simple système d'automatisation.

La vision cible est de construire une :

> **Intelligence opérationnelle évolutive**

Nexora doit progressivement être capable de comprendre une situation, raisonner dessus, prendre des décisions, poursuivre des objectifs, construire des plans, agir, observer les résultats, apprendre de ses expériences et faire évoluer ses stratégies.

L'intelligence de Nexora doit donc être construite comme un **système cognitif et opérationnel complet**, et non comme une simple interface conversationnelle.

---

# 2. VISION LONG TERME

L'architecture conceptuelle cible de Nexora est :

```text
                    ┌───────────────────┐
                    │   Cognitive Core  │
                    └─────────┬─────────┘
                              ↓
                       ┌─────────────┐
                       │ Goal Engine │
                       └──────┬──────┘
                              ↓
                    ┌──────────────────┐
                    │ Planning Engine  │
                    └────────┬─────────┘
                             ↓
                       ┌────────────┐
                       │Action Engine│
                       └──────┬─────┘
                              ↓
                        ┌───────────┐
                        │Observation│
                        └─────┬─────┘
                              ↓
                        ┌───────────┐
                        │ Evaluation│
                        └─────┬─────┘
                              ↓
                        ┌───────────┐
                        │ Experience│
                        └─────┬─────┘
                              ↓
                         ┌─────────┐
                         │Evolution│
                         └────┬────┘
                              │
                              └──────────────→ Cognitive Core
```

La mémoire vivante est transversale à cette architecture.

```text
                         ┌──────────────────┐
                         │   Living Memory  │
                         │                  │
                         │ Facts            │
                         │ Decisions        │
                         │ Experiences      │
                         │ Errors           │
                         │ Solutions        │
                         │ Strategies       │
                         │ Skills           │
                         │ Context          │
                         └────────┬─────────┘
                                  │
                                  ↓
        Cognitive → Goal → Planning → Action
             ↑                          ↓
             └── Evolution ← Experience ← Observation
```

---

# 3. OBJECTIF FONDAMENTAL

Nexora doit progressivement être capable de :

1. Comprendre une demande
2. Comprendre le contexte
3. Identifier les éléments importants
4. Identifier les objectifs
5. Identifier les exigences
6. Identifier les contraintes
7. Identifier les inconnues
8. Raisonner sur la situation
9. Identifier les implications
10. Identifier les dépendances
11. Prendre une décision
12. Définir ou poursuivre un objectif
13. Décomposer un objectif
14. Construire un plan
15. Exécuter des actions
16. Utiliser des outils
17. Observer les résultats
18. Évaluer les résultats
19. Détecter les erreurs
20. Enregistrer les expériences
21. Réutiliser les solutions
22. Améliorer ses stratégies
23. Faire évoluer son comportement
24. Réinjecter cette expérience dans les décisions futures

---

# 4. ARCHITECTURE GLOBALE DE DÉVELOPPEMENT

La progression prévue est :

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

Cette progression est volontairement incrémentale.

Le système existant ne doit pas être détruit pour reconstruire Nexora à zéro.

---

# 5. ÉTAT ACTUEL DU PROJET

## Statut global

**🟡 Architecture cognitive en construction**

Les fondations opérationnelles existent déjà.

Les systèmes suivants sont fonctionnels ou disposent d'une première implémentation :

* Chat
* Memory
* Context
* Intent
* Brain Decision
* Requirements
* Requirement Query
* Reasoning
* Cognitive Core

Le Cognitive Core constitue désormais la prochaine couche centrale à développer.

---

# 6. STRUCTURE ACTUELLE DU BACKEND

Structure principale :

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

---

# 7. STACK TECHNIQUE

## Backend

```text
NestJS
TypeScript
Prisma
SQLite
```

## Frontend

```text
Next.js
React
TypeScript
Tailwind CSS
App Router
```

---

# 8. CHAT

Le système de Chat constitue actuellement l'interface conversationnelle principale.

Le flux général actuel est :

```text
User
 ↓
Chat
 ↓
Brain
 ↓
Services cognitifs
 ↓
Response
```

Le endpoint principal de conversation est :

```text
POST /chat
```

Le système possède également une base de gestion de l'historique des conversations.

---

# 9. MEMORY

Le système Memory constitue la première fondation de la mémoire persistante de Nexora.

Il permet notamment de conserver des informations utiles à travers les conversations.

La mémoire doit évoluer progressivement vers une architecture de :

> **Living Memory**

La Living Memory devra à terme pouvoir conserver différentes catégories d'informations :

```text
Facts
Decisions
Goals
Experiences
Errors
Solutions
Strategies
Skills
Context
Preferences
Relationships
History
```

La mémoire ne doit donc pas être considérée uniquement comme :

> "historique de conversation"

mais comme une **mémoire opérationnelle exploitable par le système cognitif**.

---

# 10. CONTEXT

`ContextService` permet actuellement de reconstruire le contexte pertinent d'une conversation.

Le contexte doit progressivement devenir une représentation structurée de la situation courante.

Conceptuellement :

```text
Conversation
      ↓
Context
      ↓
Current Situation
      ↓
Cognitive Core
```

Le contexte pourra progressivement contenir :

* sujet actif ;
* objectifs ;
* exigences ;
* décisions ;
* contraintes ;
* entités ;
* historique pertinent ;
* état du projet ;
* actions précédentes ;
* résultats précédents.

---

# 11. INTENT SERVICE

`IntentService` est actuellement un système de détection d'intention basé principalement sur des règles.

Les intentions existantes comprennent notamment :

```typescript
GREETING
NEXORA_IDENTITY
USER_NAME
USER_PROJECT
PROJECT_REQUIREMENT
PROJECT_REQUIREMENTS_QUERY
UNKNOWN
```

Le système utilise notamment la normalisation et des règles lexicales.

Une protection existe également afin d'éviter qu'une question soit automatiquement interprétée comme une nouvelle exigence.

Exemple :

```text
Pourquoi Chrono Solar doit-il supporter 100 000 utilisateurs tout en restant rapide ?
```

Cette phrase est une question et ne doit pas être enregistrée automatiquement comme une nouvelle exigence.

## Limite actuelle

Le système Intent ne doit pas continuer à devenir une énorme collection de règles.

À terme :

```text
IntentService
      ↓
Understanding
      ↓
Cognitive Core
```

`IntentService` doit devenir progressivement une capacité spécialisée utilisée par le Cognitive Core.

---

# 12. BRAIN DECISION SERVICE

`BrainDecisionService` constitue actuellement la couche permettant de transformer une intention et son contexte en décision opérationnelle.

Les actions existantes comprennent notamment :

```typescript
ANSWER
CONTINUE_CONTEXT
ASK_CLARIFICATION
```

À terme, cette capacité doit être intégrée dans le composant :

```text
Cognitive Core
      ↓
Decision
```

Le service existant ne doit pas être supprimé brutalement.

Il doit être réutilisé puis progressivement enrichi.

---

# 13. REQUIREMENTS

Le système de Requirements est fonctionnel.

Il permet notamment :

* la détection des exigences ;
* la normalisation ;
* la détection des doublons ;
* la création ;
* la consultation ;
* la conservation des exigences du projet.

Le `RequirementService` possède déjà une logique de détection des doublons normalisés.

Il constitue une capacité métier spécialisée qui pourra être appelée par le Cognitive Core.

Architecture cible :

```text
User Input
     ↓
Cognitive Core
     ↓
Understanding
     ↓
Requirement Detection
     ↓
RequirementService
     ↓
Living Memory
```

---

# 14. REASONING ENGINE

`ReasoningService` constitue la première version du moteur de raisonnement de Nexora.

Il est actuellement déterministe et basé sur des règles.

Il permet notamment d'identifier :

```text
Requirements
Scalability
Target Load
Security
Performance
Dependencies
Facts
Inferences
Implications
Unknowns
Questions
```

Il peut par exemple analyser :

```text
Chrono Solar doit supporter 100 000 utilisateurs tout en restant rapide.
```

et identifier :

```text
Target Load:
100 000 utilisateurs

Implication:
L'architecture doit pouvoir absorber cette charge.

Implication:
Une capacité de planification est nécessaire.

Dependencies:
Architecture
Infrastructure
Base de données
Capacity Planning
Performance
```

## Types actuels

```typescript
FACT
REQUIREMENT
GOAL
CONSTRAINT
DECISION
QUESTION
UNKNOWN
```

## ReasoningResult

La structure actuelle contient notamment :

```typescript
subject
type
facts
inferences
unknowns
implications
dependencies
questions
```

## Principe

Le `ReasoningService` ne doit pas être remplacé.

Il doit devenir une **capacité de raisonnement spécialisée du Cognitive Core**.

---

# 15. PROBLÈME ACTUEL IDENTIFIÉ

Une question comme :

```text
Pourquoi Chrono Solar doit-il supporter 100 000 utilisateurs tout en restant rapide ?
```

peut actuellement être classifiée comme :

```text
UNKNOWN
```

par `IntentService`.

Ce comportement montre une limite du modèle actuel :

```text
Intent
↓
Action
```

Nexora doit évoluer vers :

```text
Input
 ↓
Understanding
 ↓
Reasoning
 ↓
Decision
```

Une question ne doit donc pas nécessairement être traitée comme une simple intention isolée.

Elle doit pouvoir être comprise en fonction :

* du sujet ;
* du contexte ;
* des faits connus ;
* des exigences existantes ;
* des objectifs ;
* des dépendances ;
* des connaissances mémorisées.

---

# 16. COGNITIVE CORE

## Statut

**🟡 Implémentation initiale**

Le Cognitive Core constitue désormais le noyau cognitif de Nexora.

Il ne doit pas être simplement un nouveau service parallèle.

Sa vocation est de devenir progressivement le **centre de compréhension, de raisonnement et de décision** de Nexora.

---

# 17. CONTRAT DU COGNITIVE CORE

Le Cognitive Core utilise actuellement le concept :

```text
CognitiveInput
        ↓
Cognitive Core
        ↓
CognitiveOutput
```

## CognitiveInput

```typescript
export interface CognitiveInput {
  message: string;
  conversationId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}
```

Le système peut donc recevoir :

* le message ;
* l'identifiant de conversation ;
* l'utilisateur ;
* des métadonnées supplémentaires.

---

# 18. UNDERSTANDING

Le premier niveau du Cognitive Core est :

```text
Understanding
```

Structure :

```typescript
export interface Understanding {
  intent: string;
  confidence: number;
  subject?: string;
  entities: string[];
  references: string[];
}
```

Son rôle est de répondre à :

> "Qu'est-ce qui est en train de se passer ?"

Le système commence actuellement par identifier notamment :

```text
Requirement
Goal
Question
Unknown
```

Le système est volontairement simple à cette étape.

Il sera progressivement remplacé ou enrichi par l'intégration des capacités existantes.

---

# 19. REASONING DU COGNITIVE CORE

Structure actuelle :

```typescript
export interface Reasoning {
  facts: string[];
  inferences: string[];
  unknowns: string[];
  implications: string[];
  dependencies: string[];
}
```

Le Cognitive Core doit progressivement devenir capable de produire une représentation beaucoup plus riche de la situation.

Architecture cible :

```text
Understanding
      ↓
Facts
      ↓
Inference
      ↓
Implications
      ↓
Dependencies
      ↓
Unknowns
      ↓
Reasoning State
```

Le `ReasoningService` existant sera utilisé comme capacité spécialisée.

---

# 20. DECISION DU COGNITIVE CORE

Structure actuelle :

```typescript
export interface Decision {
  action: string;
  reason: string;
  confidence: number;
}
```

Le système peut actuellement produire des décisions telles que :

```text
ASK_CLARIFICATION
PROCESS_GOAL
PROCESS_REQUIREMENT
ANSWER
CONTINUE
```

À terme, les décisions devront pouvoir être beaucoup plus opérationnelles :

```text
ANSWER
ASK_CLARIFICATION
STORE_MEMORY
CREATE_REQUIREMENT
UPDATE_REQUIREMENT
CREATE_GOAL
UPDATE_GOAL
CREATE_PLAN
EXECUTE_ACTION
USE_TOOL
OBSERVE
EVALUATE
ESCALATE
WAIT
```

---

# 21. COGNITIVE OUTPUT

Le contrat actuel est :

```typescript
export interface CognitiveOutput {
  input: CognitiveInput;
  understanding: Understanding;
  reasoning: Reasoning;
  decision: Decision;
}
```

Il représente le premier véritable contrat cognitif de Nexora.

Architecture :

```text
                     Cognitive Core
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
   Understanding      Reasoning         Decision
          │                │                │
          └────────────────┼────────────────┘
                           ↓
                  CognitiveOutput
```

---

# 22. PRINCIPE D'IMPLÉMENTATION DU COGNITIVE CORE

Le Cognitive Core doit progressivement absorber l'orchestration des capacités cognitives existantes.

Architecture immédiate cible :

```text
Chat
 ↓
Brain
 ↓
Cognitive Core
 ↓
┌─────────────────────┬─────────────────────┬─────────────────────┐
│                     │                     │
Understanding       Reasoning             Decision
│                     │                     │
↓                     ↓                     ↓
IntentService       ReasoningService     BrainDecisionService
│                     │                     │
└─────────────────────┴─────────────────────┘
                      ↓
                CognitiveOutput
```

Le `ContextService` intervient également dans la compréhension et le raisonnement :

```text
Cognitive Core
      ↓
ContextService
      ↓
Current Context
      ↓
Understanding + Reasoning
```

---

# 23. RÈGLE ARCHITECTURALE IMPORTANTE

Le Cognitive Core ne doit **pas** dépendre de `BrainService`.

La direction des dépendances doit être :

```text
Brain
  ↓
Cognitive Core
  ↓
Specialized Cognitive Services
```

et non :

```text
Cognitive Core
  ↓
Brain
```

Cela permet d'éviter une dépendance circulaire et permet au Cognitive Core de devenir progressivement le véritable centre cognitif.

---

# 24. BRAIN — ÉVOLUTION PRÉVUE

`BrainService` est actuellement important et contient encore une grande partie de la logique d'orchestration.

Il ne doit pas être réécrit brutalement.

Approche prévue :

```text
PHASE 1
Brain
 ↓
Cognitive Core
 ↓
Existing Services
```

Puis progressivement :

```text
PHASE 2

Brain
 ↓
Cognitive Core
 ↓
Goal / Planning / Action
```

Enfin :

```text
PHASE 3

Chat
 ↓
Operational Intelligence
 ↓
Cognitive Core
```

Le rôle de `BrainService` pourra alors devenir progressivement plus léger.

---

# 25. LLM

L'intégration d'un LLM n'est volontairement **pas la priorité immédiate**.

Principe architectural :

> Le LLM ne doit pas être Nexora.

Le LLM doit devenir une capacité utilisée par Nexora.

Architecture future :

```text
                    Cognitive Core
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
 Understanding        Reasoning          Decision
        │                 │                 │
        └────────────┬────┴─────┬───────────┘
                     ↓
                    LLM
                     ↓
              Advanced Cognition
```

Le système déterministe doit donc être suffisamment structuré avant de donner au LLM un rôle central.

---

# 26. GOAL ENGINE

Le Goal Engine constitue la prochaine grande couche après la stabilisation du Cognitive Core.

Son rôle sera de transformer :

```text
Understanding
+
Reasoning
+
Decision
```

en :

```text
Goal
```

Un objectif pourra posséder :

```text
ID
Title
Description
Priority
Status
Deadline
Constraints
Dependencies
Progress
Success Criteria
Context
```

Exemple :

```text
Goal:
Faire supporter 100 000 utilisateurs à Chrono Solar.

Success Criteria:
- 100 000 utilisateurs simultanés
- temps de réponse acceptable
- aucune dégradation critique
```

---

# 27. PLANNING ENGINE

Le Planning Engine devra transformer un objectif en plan.

```text
Goal
 ↓
Planning Engine
 ↓
Plan
 ↓
Tasks
```

Exemple :

```text
Goal:
Supporter 100 000 utilisateurs

Plan:
1. Analyser l'architecture actuelle
2. Identifier les bottlenecks
3. Mesurer la capacité actuelle
4. Définir l'architecture cible
5. Tester la base de données
6. Tester la charge
7. Optimiser
8. Valider
```

---

# 28. ACTION ENGINE

L'Action Engine permettra à Nexora d'exécuter les tâches.

```text
Plan
 ↓
Action Engine
 ↓
Tool / API / Service
 ↓
Result
```

Les actions pourront éventuellement utiliser :

* API ;
* fichiers ;
* bases de données ;
* navigateur ;
* outils internes ;
* services externes ;
* scripts ;
* applications.

---

# 29. OBSERVATION

Après une action, Nexora doit observer le résultat.

```text
Action
 ↓
Result
 ↓
Observation
```

L'observation doit être structurée.

Exemple :

```text
Action:
Test de charge

Observation:
Le système commence à ralentir à 72 000 utilisateurs.

Signal:
Performance degradation

Threshold:
72 000
```

---

# 30. EVALUATION

L'évaluation permet de déterminer si l'action a fonctionné.

```text
Goal
 +
Expected Result
 +
Observation
 ↓
Evaluation
```

Exemple :

```text
Goal:
100 000 utilisateurs

Observation:
72 000 utilisateurs maximum

Evaluation:
FAILED

Reason:
Infrastructure insuffisante
```

---

# 31. EXPERIENCE ENGINE

Une évaluation doit pouvoir produire une expérience.

```text
Observation
 ↓
Evaluation
 ↓
Experience
```

Exemple :

```text
Experience:

Lorsqu'une architecture donnée dépasse 72 000 utilisateurs,
la base de données devient le principal bottleneck.
```

Cette expérience doit pouvoir être mémorisée.

---

# 32. EVOLUTION ENGINE

L'évolution transforme les expériences en amélioration future.

```text
Experience
 ↓
Evolution
 ↓
Strategy Update
 ↓
Future Decision
```

Exemple :

```text
Experience:
Database bottleneck à 72 000 utilisateurs

Evolution:
Privilégier une architecture database scalable
lors de futurs projets similaires.
```

---

# 33. LIVING MEMORY

La Living Memory doit devenir le système permettant à Nexora de conserver ce qu'il apprend.

Architecture cible :

```text
                   Living Memory
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
     Facts           Decisions        Experiences
       ↓                 ↓                 ↓
     Errors          Solutions        Strategies
       ↓                 ↓                 ↓
    Context           Skills          Knowledge
```

La mémoire doit être accessible aux différents moteurs :

```text
Cognitive Core
Goal Engine
Planning Engine
Action Engine
Observation
Evaluation
Experience
Evolution
```

---

# 34. ARCHITECTURE COGNITIVE CIBLE

À maturité :

```text
                         USER
                           ↓
                         CHAT
                           ↓
                   ┌───────────────┐
                   │ Cognitive Core│
                   └───────┬───────┘
                           ↓
                 ┌──────────────────┐
                 │   Understanding  │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │     Reasoning    │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │     Decision     │
                 └────────┬─────────┘
                          ↓
                    ┌────────────┐
                    │ Goal Engine│
                    └─────┬──────┘
                          ↓
                  ┌───────────────┐
                  │Planning Engine│
                  └───────┬───────┘
                          ↓
                    ┌───────────┐
                    │Action Engine│
                    └─────┬─────┘
                          ↓
                      ACTION
                          ↓
                    OBSERVATION
                          ↓
                     EVALUATION
                          ↓
                     EXPERIENCE
                          ↓
                      EVOLUTION
                          ↓
                   LIVING MEMORY
                          ↓
                   Cognitive Core
```

---

# 35. MODULES FUTURS

Les futurs modules principaux seront progressivement :

```text
core/
├── cognitive/
├── goals/
├── planning/
├── actions/
├── observation/
├── evaluation/
├── experience/
└── evolution/
```

Avec éventuellement :

```text
tools/
knowledge/
security/
orchestration/
```

---

# 36. PRINCIPES DE DÉVELOPPEMENT

## Principe 1 — Pas de Big Bang

Ne jamais réécrire tout Nexora en une seule étape.

Chaque couche doit être introduite progressivement.

---

## Principe 2 — Préserver l'existant

Les services existants sont des capacités utiles.

Ils doivent être intégrés avant d'être remplacés.

---

## Principe 3 — Cognitive Core central

Le Cognitive Core doit progressivement devenir le centre de la cognition.

---

## Principe 4 — LLM ≠ Intelligence complète

Le LLM est une capacité.

Il ne doit pas remplacer :

* Memory ;
* Context ;
* Reasoning ;
* Decision ;
* Goals ;
* Planning ;
* Actions ;
* Evaluation ;
* Experience ;
* Evolution.

---

## Principe 5 — Tout doit être structuré

Nexora doit progressivement produire des données structurées plutôt que des réponses textuelles uniquement.

---

## Principe 6 — Traçabilité

Les décisions importantes doivent pouvoir être expliquées par :

```text
Input
 ↓
Context
 ↓
Understanding
 ↓
Reasoning
 ↓
Decision
```

---

## Principe 7 — Évolution contrôlée

Nexora ne doit pas simplement "apprendre".

Il doit pouvoir :

```text
Observe
 ↓
Evaluate
 ↓
Store Experience
 ↓
Identify Pattern
 ↓
Update Strategy
```

---

# 37. ÉTAT DES COMPOSANTS

| Composant         | Statut | Rôle                              |
| ----------------- | ------ | --------------------------------- |
| Chat              | 🟢     | Interface conversationnelle       |
| Memory            | 🟢     | Mémoire persistante initiale      |
| Context           | 🟢     | Gestion du contexte               |
| Intent            | 🟡     | Détection d'intention par règles  |
| Brain Decision    | 🟡     | Décision initiale                 |
| Requirements      | 🟢     | Gestion des exigences             |
| Requirement Query | 🟢     | Consultation des exigences        |
| Reasoning         | 🟡     | Raisonnement déterministe initial |
| Cognitive Core    | 🟡     | Nouveau noyau cognitif            |
| LLM               | ⚪      | Pas encore intégré                |
| Goal Engine       | ⚪      | À construire                      |
| Planning Engine   | ⚪      | À construire                      |
| Action Engine     | ⚪      | À construire                      |
| Observation       | ⚪      | À construire                      |
| Evaluation        | ⚪      | À construire                      |
| Experience        | ⚪      | À construire                      |
| Evolution         | ⚪      | À construire                      |
| Advanced Frontend | ⚪      | À construire                      |
| Security          | ⚪      | À renforcer                       |
| Testing           | 🟡     | À développer progressivement      |

Légende :

```text
🟢 Fonctionnel
🟡 En développement
⚪ Non commencé
```

---

# 38. DERNIER CHECKPOINT GIT

Le dernier checkpoint important du Cognitive Core est :

```text
Commit:
4e35a2d

Message:
feat: establish cognitive core contract
```

Ce commit correspond à la mise en place du contrat initial :

```text
CognitiveInput
      ↓
Cognitive Core
      ↓
CognitiveOutput
```

avec :

```text
Understanding
Reasoning
Decision
```

---

# 39. PROCHAINE ÉTAPE IMMÉDIATE

La prochaine étape de développement est :

> **Intégrer les capacités cognitives existantes dans le Cognitive Core.**

Services concernés :

```text
IntentService
ContextService
ReasoningService
BrainDecisionService
```

Objectif :

```text
CognitiveInput
      ↓
Cognitive Core
      ↓
Context
      ↓
Understanding
      ↓
Reasoning
      ↓
Decision
      ↓
CognitiveOutput
```

Important :

* ne pas supprimer `IntentService` ;
* ne pas supprimer `ReasoningService` ;
* ne pas supprimer `ContextService` ;
* ne pas supprimer `BrainDecisionService` ;
* ne pas réécrire immédiatement `BrainService` ;
* ne pas intégrer immédiatement le LLM ;
* éviter toute dépendance circulaire.

---

# 40. PROGRESSION IMMÉDIATE PRÉVUE

La séquence de travail recommandée est :

```text
1. Stabiliser CognitiveOutput
        ↓
2. Intégrer ContextService
        ↓
3. Intégrer IntentService
        ↓
4. Intégrer ReasoningService
        ↓
5. Intégrer BrainDecisionService
        ↓
6. Faire consommer CognitiveOutput par Brain
        ↓
7. Réduire progressivement la logique cognitive de Brain
        ↓
8. Stabiliser Cognitive Core
        ↓
9. Construire Goal Engine
        ↓
10. Construire Planning Engine
        ↓
11. Construire Action Engine
        ↓
12. Construire Observation
        ↓
13. Construire Evaluation
        ↓
14. Construire Experience
        ↓
15. Construire Evolution
```

---

# 41. WORKFLOW OBLIGATOIRE POUR CHAQUE ÉTAPE

Chaque évolution du projet doit suivre ce format :

## 1. OBJECTIF

Définir précisément ce qui doit être construit.

## 2. FICHIERS À MODIFIER

Lister précisément les fichiers concernés.

## 3. CODE COMPLET À COPIER

Fournir le contenu complet des fichiers modifiés.

Éviter les extraits incomplets lorsque cela risque de provoquer des erreurs.

## 4. TEST EXACT À FAIRE

Donner les commandes exactes à exécuter.

## 5. LOG ATTENDU

Indiquer précisément ce que l'utilisateur doit observer.

## 6. VALIDATION

Confirmer que l'étape est correcte avant de continuer.

## 7. GIT COMMIT

Donner la commande exacte :

```bash
git add ...
git commit -m "..."
git push origin main
```

## 8. MISE À JOUR NEXORA_STATE.md

Après chaque étape importante, mettre à jour ce fichier.

---

# 42. RÈGLE DE CONTINUITÉ

`NEXORA_STATE.md` est la référence principale permettant de reprendre le développement de Nexora.

Toute modification architecturale importante doit être documentée ici.

Le fichier doit toujours permettre de répondre rapidement à :

```text
Où en est Nexora ?
Qu'est-ce qui fonctionne ?
Qu'est-ce qui est en construction ?
Quelle est l'architecture cible ?
Quelle est la prochaine étape ?
Quels fichiers ont été modifiés ?
Quel est le dernier checkpoint Git ?
```

---

# 43. PHILOSOPHIE FINALE DE NEXORA

Nexora ne doit pas être conçu comme :

```text
User
 ↓
Prompt
 ↓
LLM
 ↓
Answer
```

mais progressivement comme :

```text
                    SITUATION
                        ↓
                 UNDERSTANDING
                        ↓
                    CONTEXT
                        ↓
                    REASONING
                        ↓
                    DECISION
                        ↓
                      GOAL
                        ↓
                     PLAN
                        ↓
                     ACTION
                        ↓
                  OBSERVATION
                        ↓
                   EVALUATION
                        ↓
                   EXPERIENCE
                        ↓
                    EVOLUTION
                        ↓
                 LIVING MEMORY
                        ↓
                 FUTURE COGNITION
```

C'est cette boucle qui doit permettre à Nexora de devenir une véritable :

> **Intelligence opérationnelle évolutive.**

---

# 44. ÉTAT DE RÉFÉRENCE

À la reprise du développement, considérer comme référence :

```text
Repository:
IseiShoda/nexora

Branch:
main

Dernier checkpoint Cognitive Core:
4e35a2d

Architecture cognitive:
CognitiveInput
↓
Understanding
↓
Reasoning
↓
Decision
↓
CognitiveOutput

Architecture long terme:
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
↺ Cognitive Core
```

**Prochaine action technique :**

```text
Intégrer progressivement
IntentService
ContextService
ReasoningService
BrainDecisionService
dans CognitiveCoreService
sans casser le fonctionnement actuel de Brain.
```
