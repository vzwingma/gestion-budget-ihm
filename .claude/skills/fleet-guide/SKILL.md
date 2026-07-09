---
name: "fleet-guide"
description: "Skill — Guide parallélisation `/fleet` pour tous agents. Appliqué automatiquement."
applyTo: "**"
---

# Skill : Parallélisation avec /fleet

> `/fleet` = mode exécution parallèle CLI Claude. Dispatche plusieurs sous-agents simultanément, réduit temps total.

---

## Quand utiliser /fleet

- **Tâches indépendantes même agent**: plusieurs composants/services/fichiers sans dépendance
- **Délégation multi-agents parallèle**: deux agents démarrent simultanément (ex: QALvin + DOCly même feature après DEVon)
- **Phases parallèles Plan d'Action**: deux phases s'exécutent simultanément

---

## Quand NE PAS utiliser /fleet

- Tâche B **dépend résultat** tâche A
- Deux sous-tâches **modifient même fichier** (risque conflit)
- Fichier setup commun doit être créé d'abord

---

## Comment indiquer usage /fleet

Dans plan ou délégation, signaler tâches parallélisables:

```
💡 Ces tâches sont indépendantes → lancer en /fleet :
- Tâche A (Agent X)
- Tâche B (Agent Y)
```

---

## Règle de décision

| Situation | Mode recommandé |
|---|---|
| Tâche B dépend tâche A | Séquentiel |
| Tâches A et B sans lien | `/fleet` |
| DEVon terminé → QALvin + DOCly | `/fleet` pour QALvin + DOCly |
| Plusieurs éléments indépendants | `/fleet` |