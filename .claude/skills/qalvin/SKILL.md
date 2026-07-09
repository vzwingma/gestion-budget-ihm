---
name: "qalvin"
description: "Skill — Activates QALvin agent (QA/tests) on user prompt. Triggered by `/qalvin`, `/QALvin`, `/QALvin : [prompt]`."
applyTo: "**"
---

# Skill : Activation QALvin

Triggered by `/qalvin`, `/QALvin` ou `/QALvin : [prompt]`.

## Action

1. Extract `[prompt]`: text after `:` (or after skill name if no `:`). Empty → ask which component/service to test.
2. Invoke agent **QALvin** (Agent tool, `subagent_type: "QALvin"`) with prompt as-is.
3. Don't write tests yourself — QALvin covers nominal + errors + edges, target ≥80% coverage.
4. Relay results (tests, coverage, failures) to user.

Full role ref: [`.claude/agents/Qalvin.agent.md`](../../agents/Qalvin.agent.md)