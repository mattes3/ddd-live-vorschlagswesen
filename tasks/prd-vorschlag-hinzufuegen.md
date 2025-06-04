# PRD: Vorschlag hinzufügen UI

## Introduction/Overview

The "Vorschlag hinzufügen" UI is designed to allow employees to submit proposals (Vorschläge) for company improvements. This feature aims to facilitate the collection of innovative ideas from employees, which can later be reviewed by managers for feasibility and approval.

## Goals

- Enable employees to submit proposals with all necessary attributes.
- Ensure data validation for all fields before submission.
- Store new proposals in the database with the initial state of "NEU".

## User Stories

- As an employee, I want to submit a proposal with all the attributes contained in the Vorschlag class so that I can contribute to company improvements.

## Functional Requirements

1. The UI must allow employees to enter the following data using standard HTML and HTMX:
   - Title (titel)
   - Business Advantage (businessVorteil)
   - Possible Implementation Effort (moeglicherUmsetzungsAufwand)
   - Possible Time Frame (moeglicherZeitrahmen)
   - Non-Implementation Consequences (nichtUmsKonsequenzen)

2. The UI must validate all fields before allowing submission.

3. Upon successful submission, a new proposal must be created in the database with the Zustand "NEU".

## Non-Goals (Out of Scope)

- The UI will not handle proposal approval or rejection processes.

## Design Considerations

- The UI should be a simple form with a submit button.
- The UI should be based on web request handlers similar to `VorschlagIndexhandlers.ts`.

## Success Metrics

- Successful validation of all fields.
- Creation of a new proposal in the database with the state "NEU".

## Open Questions

- None identified at this time.
