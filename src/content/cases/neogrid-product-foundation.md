---
order: 1
title: "Reducing delivery time with a shared product foundation"
summary: "A component-based foundation across Angular and NestJS that cut customized enterprise product delivery from 6–10 months to 3–4 months."
company: "Neogrid"
role: "Senior Software Architect — Special Projects"
metric:
  label: "Delivery time for customized products"
  before: "6–10 months"
  after: "3–4 months"
stack:
  - "Angular"
  - "NestJS"
  - "TypeScript"
  - "Node.js"
  - "Java / Spring Boot"
  - "Quarkus"
  - "GraphQL"
  - "Microservices"
  - "Multi-tenant architecture"
---

## Context

The Special Projects team built customized versions of Neogrid's supply-chain products for strategic customers. The company was mid-way through its cloud journey, breaking monoliths into microservices and launching new products, while most delivery still ran on Java/Spring Boot and a JSF-based frontend.

## The problem

Every customer project rebuilt much of the same technical foundation. Depending on scope, deliveries took 6 to 10 months, and the legacy UI stack made new screens slow to build and hard to keep consistent.

## What I did

- **Frontend:** introduced Angular as the foundation of the frontend modernization and built a shared component library and a new visual identity. The team adapted well to Angular.
- **Backend:** extended the component model to the backend by building a shared NestJS foundation integrated with Neogrid's multi-tenant architecture. Common technical capabilities were separated from customer-specific business rules, so new projects could assemble proven modules instead of rebuilding the same infrastructure.
- **Teams:** led the rollout of the microservices architecture and mentored engineers on Node.js, NestJS, GraphQL, Spring Boot and Quarkus.

## Key decisions

- **Reuse across the whole stack, not just the UI.** The biggest delivery gains came from turning recurring frontend and backend patterns into a shared product foundation.
- **One mental model across frontend and backend.** NestJS's modular, dependency-injection-based, TypeScript-first architecture mirrors Angular, which made the platform easier for teams to understand and extend.
- **Incremental modernization instead of a rewrite.** New NestJS services ran alongside the existing Java/Spring ecosystem, so teams modernized where it created value without disrupting running products.
- **Business logic stayed outside the platform.** The shared layer provided technical building blocks while customer-specific behavior remained isolated, which kept the foundation from becoming another monolith.

## Outcome

- Delivery time for customized products dropped from **6–10 months to 3–4 months**, depending on scope.
- Reusable components across frontend and backend, and a consistent UX across customer products.
- The team adapted well to Angular as the new frontend foundation.
