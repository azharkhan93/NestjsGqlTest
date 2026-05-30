---
trigger: always_on
---

TypeScript Standards:
- Never use `any`.
- Never suppress type safety.
- Never use `@ts-ignore` unless absolutely unavoidable and explicitly justified.
- Avoid unsafe type assertions.
- Avoid abusing `as const`.
- Prefer exact and explicit types.
- Always create dedicated types/interfaces.
- Reuse generated GraphQL types whenever possible.
- Prefer readonly types where applicable.
- Never leave function parameters implicitly typed.
- Strong typing is mandatory across: