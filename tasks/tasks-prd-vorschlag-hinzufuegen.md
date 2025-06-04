## Relevant Files

- `packages/containers/vorschlag/backend/src/handlers/VorschlagHinzufuegenHandler.ts` - Web request handler for Vorschlag submission.
- `packages/domainlogic/vorschlag/src/domain/VorschlagService.ts` - Service interface for handling Vorschlag operations.
- `packages/domainlogic/vorschlag/src/domain/VorschlagServiceImpl.ts` - Implementation of VorschlagService.

### Notes

- Unit tests should typically be placed in the `test` folder next to the `src` folder that is a parent for the code files they are testing (e.g., `src/path/to/myrequesthandler.ts` and `test/path/to/myrequesthandler.test.ts`).
- Use `vitest` to run tests. Running without a path executes all tests found by the vite configuration.
- Avoid using client side custom components as long as the backend can do the job.

## Tasks

- [x] 1.0 Create the Vorschlag hinzufügen form
  - [x] 1.1 Implement the form UI using standard HTML and HTMX
  - [x] 1.2 Ensure the form submits data to the backend handler

- [ ] 2.0 Implement the backend handler for Vorschlag submission
  - [ ] 2.1 Create a web request handler to process form submissions
  - [ ] 2.2 Validate incoming data and handle errors
  - [ ] 2.3 Store new proposals in the database with Zustand "NEU", using the existing VorschlagService.fuegeVorschlagHinzu() method. Don't create a new method in the service.
