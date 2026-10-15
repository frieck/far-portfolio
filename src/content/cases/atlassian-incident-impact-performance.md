---
order: 3
title: "From minutes to sub-second incident-impact queries"
summary: "Query optimization and daily data preparation for an internal tool used by Atlassian Support Engineers to estimate incident impact."
intro: "I optimized incident-impact queries and implemented a daily job that consolidated data lake records into a database structure grouped by endpoint and HTTP method. On the validated queries for the most-accessed endpoints, execution time fell from around five minutes or more to under one second."
company: "Atlassian"
via: "e-Core"
role: "Senior Software Specialist — via e-Core"
metric:
  label: "Query execution time"
  caption: "Validated queries · most-accessed endpoints"
  before: "~5 minutes or more"
  after: "<1 second"
focus:
  - "Query optimization"
  - "Data consolidation"
  - "Data denormalization"
  - "Daily data preparation"
---

## Context

Atlassian's Support Engineers needed to estimate the reach of an incident: how many active customers, apps and Marketplace partners were affected when an endpoint stopped responding or showed degraded performance. They did this through an internal system that queried data distributed across several tables in a data lake.

## The problem

The queries that calculated this impact took close to five minutes or longer to return.

## What I did

- **Investigated** the queries, the data and its sources directly.
- **Optimized the queries** used to calculate the impact.
- **Decided on and implemented a daily data preparation job** that fetched the source data and consolidated it into a denormalized structure grouped by endpoint and HTTP method, stored in a database for querying.
- **Validated the performance** on the most-accessed endpoints, which had the most entries in the data lake.

## Key decisions

- **Prepare the data, not only tune the queries.** Alongside optimizing the queries, I prepared the data in advance in the structure the impact queries needed: grouped by endpoint and HTTP method.
- **Daily preparation, matching the source.** The source data was updated daily, not hourly, so the preparation followed the same cadence, using D‑1 as the reference and a rolling window from D‑1 minus 30 days through D‑1. The prepared dataset reflected data through the previous day, rather than real-time updates.
- **Validate on the most-accessed endpoints.** Performance was checked on the most-accessed endpoints, the ones with the most entries in the data lake.

## Outcome

On the validated queries for the most-accessed endpoints, execution time dropped from around five minutes or more to under one second.
