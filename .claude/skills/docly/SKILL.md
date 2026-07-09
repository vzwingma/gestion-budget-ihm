---
name: "docly"
description: "Skill — Active agent DOCly (documentation) sur prompt utilisateur. Déclenché par `/docly`, `/DOCly`, `/DOCly : [prompt]`."
applyTo: "**"
---

# Skill : Activation DOCly

Déclenché par `/docly`, `/DOCly` ou `/DOCly : [prompt]`.

## Action

1. Extraire `[prompt]` : texte après `:` (ou après nom skill si pas `:`). Vide → demander quelle doc update.
2. Invoquer agent **DOCly** (Agent tool, `subagent_type: "DOCly"`) avec prompt tel quel.
3. Ne pas rédiger doc soi-même — DOCly maintient README, docs/, ADRs sync avec code.
4. Relayer résultat (fichiers modifiés) à utilisateur.

Réf rôle complet : [`.claude/agents/Docly.agent.md`](../../agents/Docly.agent.md)