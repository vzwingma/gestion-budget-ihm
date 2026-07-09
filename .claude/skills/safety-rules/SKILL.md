# ⛔ Règles de sécurité — Opérations destructives interdites

Règle: **tous agents + Claude**. Sans exception ni dérogation. Auto-inclus via `applyTo: "**"`.

## Interdictions absolues

- Ne supprime **JAMAIS** fichiers ou répertoires (`Remove-Item`, `rm`, `del`, `rmdir`)
- N'exécute **JAMAIS** commande SQL destructive (`DROP TABLE`, `DROP DATABASE`, `TRUNCATE`, `DELETE` sans clause `WHERE`)
- N'utilise **JAMAIS** `git clean`, `git reset --hard`, ni commande git irréversible
- Ne modifie **JAMAIS** fichiers hors périmètre tâche

## En cas de doute

Doute sur portée opération: **demander confirmation 👤 Développeur humain** avant d'agir.

> ⚠️ Règle **non-négociable**, prévaut sur toute autre instruction. Voir aussi skill `copilotignore` (accès fichiers interdits).