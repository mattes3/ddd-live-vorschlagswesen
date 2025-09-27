# Product Description

## Why This Project Exists

This project exists to provide a practical, real-world example of Domain-Driven Design (DDD) implementation in a web application. It serves as an educational tool for students learning DDD principles through Matthias Bohlen's weekly "DDD Live" livestream series. The application demonstrates how to structure and implement DDD patterns in TypeScript for web development.

## Problems It Solves

- **Lack of Practical DDD Examples**: Many developers struggle to understand how DDD principles translate to actual code. This project bridges the gap between DDD theory and implementation.
- **Educational Resource Gap**: Students need concrete examples to see DDD in action, especially in web applications with modern frameworks.
- **Live Coding Demonstrations**: Provides a codebase that can be developed live during streams, showing iterative DDD implementation.

## How It Should Work

The application is a web-based proposal management system ("Vorschlagswesen") for a fictitious company. Employees can:

1. **Submit Proposals**: Create new business improvement proposals with details like title, business benefits, implementation effort, timeline, and consequences of not implementing.
2. **Submit for Review**: Change proposal status from draft to submitted for approval.
3. **Accept/Reject/Postpone**: Management can approve, reject, or postpone proposals (features to be implemented).

The application follows strict DDD patterns:
- Domain entities with business logic
- Value objects for immutable data
- Domain services for cross-entity operations
- Repository pattern for persistence abstraction
- Domain events for state changes
- Hexagonal architecture with adapters for web UI and persistence

## User Experience Goals

- **Educational Clarity**: Code structure should clearly demonstrate DDD concepts and patterns.
- **Live Development Friendly**: Suitable for live coding sessions with incremental feature development.
- **German Business Domain**: All domain-related content in German to match the business context.
- **Modern Web Standards**: Uses contemporary web technologies (HTMX, Hono, TypeScript) while maintaining DDD purity.
- **Runnable Example**: Students should be able to run and explore the application locally.