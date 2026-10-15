---
order: 2
title: "AI as a decision layer, not the whole product"
summary: "Zero-to-one architecture for an AI lead qualification product, combining deterministic workflows with model-driven decisions."
company: "AlvoUP"
role: "CTO & Co-Founder"
stack:
  - "Node.js"
  - "TypeScript"
  - "Python"
  - "PHP"
  - "React"
  - "Angular"
  - "OpenAI and other LLM providers"
  - "n8n / Make"
  - "Meta / Instagram campaigns"
  - "AWS"
---

## Context

AlvoUP was an early-stage startup I co-founded to help businesses improve lead generation, qualification and conversion while reducing manual work in customer interaction and commercial automation. As CTO, I owned the technical roadmap and the software architecture while staying hands-on across backend services, frontend applications, integrations and AI capabilities.

## The problem

Not every lead that reaches a business is ready to buy. Telling early curiosity apart from real commercial intent, and responding to each one appropriately, took manual effort that did not scale.

## How the product worked

The core interaction flow was:

1. **Lead and context:** a lead arrives through messaging channels or digital campaigns, including Meta/Instagram.
2. **Interpret:** agents used business context to interpret the conversation. Prompt and context engineering was a large part of the work.
3. **Identify intent:** distinguish early curiosity and initial interest from potential commercial opportunities.
4. **Qualify:** separate people who are just exploring from leads with higher intent or conversion potential.
5. **Act:** trigger the right integration or automation.
6. **Continue:** keep the conversation going, start a commercial action, or hand off to a human.

This was not a single chatbot. Context understanding, lead interaction, qualification and next-step decisions ran as multiple specialized agentic workflows.

## Key decisions

- **Not everything should be agentic.** Predictable steps ran as deterministic workflows. Model-driven decisions were reserved for the points that needed semantic interpretation or business context.
- **The model decides, the system executes.** The LLM acted as a decision layer, while the surrounding system controlled workflow execution. This separated model-driven decisions from system-controlled actions.
- **Designed for the realities of AI in production.** Reliability, latency, cost per call, recovery from failures and human-in-the-loop handoff were architectural concerns from the start, not afterthoughts.
- **A pragmatic stack, not polyglot by principle.** Each part used the tool that fit the problem: Node.js/TypeScript for services, APIs and integrations; Python where the AI ecosystem helped; PHP in existing and specific parts; React and Angular on the frontend; n8n and Make for automation.
- **Cloud foundations for fast iteration.** AWS-based infrastructure supported scalability, reliability, rapid experimentation and continuous delivery.

## Outcome

- An early-stage product with infrastructure, campaigns, integrations and agentic workflows working end to end.
- A clear separation between model-driven decisions and deterministic execution, designed to keep behavior predictable and failures recoverable.
