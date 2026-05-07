---
name: migrate-to-template
description: >
  Aide à transformer un projet existant pour utiliser ce dépôt transverse comme source de templates.
  Utile quand : "transforme ce projet pour utiliser les templates Copilot", 
  "migre les instructions Copilot vers le template", "initialise Copilot dans ce projet".
---

# Migration d'un Projet vers les Templates Copilot

Ce prompt aide à **transformer un projet existant** pour utiliser les templates et les agents définis dans ce dépôt transverse.

## 🎯 Objectif

Donner à un **projet existant** une **configuration Copilot complète et structurée** en utilisant :
- Le template générique d'instructions Copilot
- Les agents pré-définis
- Les prompts réutilisables

---

## 📋 Étapes de Migration

### 1. Analyser l'État Actuel du Projet

Vérifier si le projet a :
- [ ] Un fichier `.github/copilot-instructions.md` existant ? (Note : contenu, taille)
- [ ] Des agents définis localement ? (`.github/agents/*.md`)
- [ ] Des prompts personnalisés ? (`.github/prompts/`)
- [ ] Une structure de Plans d'Action ? (`.github/plans/`)
- [ ] Un fichier de conventions (CONTRIBUTING.md, ARCHITECTURE.md, etc.)

### 2. Sauvegarder les Instructions Existantes (si applicable)

Si le projet a déjà des instructions Copilot :
```bash
# Archiver les instructions existantes
cp .github/copilot-instructions.md .github/copilot-instructions.old.md
# Ou les stocker dans un dossier archive
mkdir -p .github/archives
cp .github/copilot-instructions.md .github/archives/copilot-instructions-backup.md
```

### 3. Copier les Agents du Dépôt Transverse

Copier les fichiers agents génériques dans le projet cible :

```bash
# Depuis le dépôt transverse vers le projet cible
cp copilot-templates/.github/agents/*.md <projet_cible>/.github/agents/
```

Les agents à copier :
- `Devon.agent.md`
- `Qalvin.agent.md`
- `Arcos.agent.md`
- `Docly.agent.md`

### 4. Copier les Prompts Réutilisables et Templates docs

```bash
# Prompts
cp copilot-templates/.github/prompts/*.md <projet_cible>/.github/prompts/

# Copier aussi le guide PLANS.md
cp copilot-templates/.github/PLANS.md <projet_cible>/.github/

# Copier les templates de documentation
mkdir -p <projet_cible>/docs/adr
cp copilot-templates/docs/ARCHITECTURE.template.md <projet_cible>/docs/ARCHITECTURE.md
cp copilot-templates/docs/adr/ADR-TEMPLATE.md <projet_cible>/docs/adr/ADR-TEMPLATE.md
```

> 💡 **Les étapes 3 et 4 sont indépendantes** — elles peuvent être exécutées en parallèle avec `/fleet`.

### 5. Initialiser les Instructions Copilot

Deux approches :

#### **Option A : Génération Automatique (Recommandée)**
```
👤 "Initialise les instructions Copilot pour ce projet"
```

Cela va :
1. Lire le template générique
2. Analyser le code source
3. Générer `.github/copilot-instructions.md` avec les bonnes valeurs

#### **Option B : Copier et Customiser Manuellement**
```bash
# Copier le template
cp copilot-templates/.github/copilot-instructions.template.md <projet_cible>/.github/copilot-instructions.md

# Ouvrir et remplir les placeholders [...]
# - Description du projet
# - Commandes
# - Architecture
# - Conventions clés
```

### 6. Copier et personnaliser les fichiers d'instructions agents

```bash
# Copier les templates d'instructions agents depuis le dépôt transverse
cp copilot-templates/.github/instructions/*.instructions.md <projet_cible>/.github/instructions/
```

Dans chaque fichier copié, remplacer au minimum les placeholders suivants :
- `[NOM_DU_PROJET]` → nom du projet cible
- `[DESCRIPTION_COURTE_DU_PROJET]` → type de projet (ex: frontend React/TypeScript)

Puis personnaliser selon le rôle de chaque agent :
- `dev.instructions.md` : stack technique réelle, versions, chemins de fichiers
- `qa.instructions.md` : framework de test réel, commandes CI, chemins de rapport
- `doc.instructions.md` : chemin docs/ réel, noms des fichiers de documentation existants
- `architect.instructions.md` : couches réelles du projet, noms des providers, service HTTP

Si certains placeholders ne peuvent pas être déterminés pendant la migration, les conserver tels quels et les signaler explicitement pour revue manuelle.

> 💡 **Les étapes 6 et 7 peuvent être parallélisées** : la personnalisation des instructions et l'enrichissement via le prompt `update-copilot-instructions` sont indépendants si les placeholders sont déjà identifiés.

### 7. Valider et Enrichir

```
👤 "Complète les instructions Copilot depuis le code source"
```

Cela va auditer le code et enrichir les sections manquantes.

### 8. Créer la Structure des Plans d'Action

```bash
# Créer le dossier plans s'il n'existe pas
mkdir -p .github/plans

# Créer un README dans plans/
cat > .github/plans/README.md << 'EOF'
# Plans d'Action

Ce dossier contient les Plans d'Action pour orchestrer le développement.
Voir [`.github/PLANS.md`](../PLANS.md) pour le guide complet.
EOF
```

### 9. Committer les Changements

```bash
git add .github/
git commit -m "chore: initialiser Copilot avec templates transverses

- Copier les agents génériques
- Copier les fichiers d'instructions agents (.github/instructions/)
- Initialiser copilot-instructions.md depuis le template
- Configurer la structure des Plans d'Action
- Référencer le guide PLANS.md

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## ✅ Checklist de Validation

Après la migration, vérifier :

- [ ] `.github/agents/` contient 4 fichiers (`Devon.agent.md`, `Qalvin.agent.md`, `Arcos.agent.md`, `Docly.agent.md`)
- [ ] `.github/instructions/` contient 4 fichiers (architect, dev, qa, doc)
- [ ] `.github/copilot-instructions.md` existe et est customisé pour le projet
- [ ] Aucun placeholder `[...]` ne subsiste dans copilot-instructions.md
- [ ] Placeholders critiques remplacés dans les fichiers d'instructions (au minimum : NOM_DU_PROJET)
- [ ] `.github/PLANS.md` est accessible (ou référencé)
- [ ] `.github/prompts/` contient les prompts réutilisables
- [ ] `docs/ARCHITECTURE.md` existe (créer depuis le template : `cp docs/ARCHITECTURE.template.md docs/ARCHITECTURE.md`)
- [ ] `docs/adr/` existe (créer si absent)
- [ ] `.github/plans/README.md` existe
- [ ] Agents sont génériques (pas de spécificités du projet)
- [ ] Instructions Copilot reflètent le projet spécifique

---

## 🔄 Après la Migration

### Utiliser les Agents

Quand vous avez besoin de :
- **Implémenter une fonctionnalité** → `/solve [task]` ou appeler `Devon` (🔵 DEV)
- **Écrire des tests** → appeler `Qalvin` (🟢 QUAL)
- **Planifier une architecture** → appeler `Arcos` (🟠 ARC)
- **Mettre à jour la documentation** → appeler `Docly` (🟣 DOC)

### Maintenir les Instructions

Régulièrement (ex: mensuellement), exécuter :
```
👤 "Complète les instructions Copilot depuis le code source"
```

Pour garder les instructions synchronisées avec le code réel.

### Lancer un Plan d'Action

Quand vous avez une initiative majeure :
```
👤 "Conçois une architecture et un plan d'action pour [initiative]"
```

`Arcos` (🟠 ARC) va créer le plan, puis les autres agents l'exécutent.

---

## 💡 Bonnes Pratiques

1. **Les agents sont génériques** — ne pas modifier leurs fichiers `.agent.md` à moins d'une mise à jour majeure
2. **Les instructions sont spécifiques** — `.github/copilot-instructions.md` doit être unique au projet
3. **Les prompts sont réutilisables** — les prompts `.prompt.md` peuvent être copiés dans d'autres projets
4. **Le guide PLANS.md est stable** — référer le depuis `.github/plans/README.md` plutôt que de dupliquer

---

## 🆘 Troubleshooting

| Problème | Solution |
|----------|----------|
| Les agents ne se reconnaissent pas | Vérifier qu'ils sont tous copiés et accessibles |
| copilot-instructions.md a des placeholders | Utiliser le prompt `init-copilot-instructions` pour remplir |
| Les prompts ne fonctionnent pas | Vérifier que les paths relatifs `.github/...` sont corrects |
| Les instructions sont obsolètes | Exécuter le prompt `update-copilot-instructions` régulièrement |

---

## 📚 Ressources

- **Template générique** : `.github/copilot-instructions.template.md`
- **Prompts** : `.github/prompts/`
- **Agents** : `.github/agents/`
- **Instructions agents** : `.github/instructions/`
- **Plans** : `.github/PLANS.md`
- **Exemples** : `.github/examples/`

---

**Après cette migration, votre projet est prêt à collaborer avec Copilot en utilisant une architecture multi-agents coordonnée ! 🚀**



