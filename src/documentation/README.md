


# File extensions

* `.svc.ts` => services, cronjob, .on database
* `.model.ts` => database models
* `.dao.ts` => fichier de configuration de model
* `.test.ts` => api tests
* `.test-flow.ts` => api tests index
* `.spec.ts` => unit tests


# Generate file

If you have the vscode module core-backend installed:
* FI => generate backend...

The raw templates are in the core-backend template folder


# Snippets

Each file type has it's own set of snippets that begin by file extension (eg `dao` => `dao:filter` or `dao:mask`)


# Testing API

* run the backend in dev mode (with hot reload) (F5 in vscode or (Todo document for IntelliJ))
* in another terminal: `npm run test:api`
* If you modify tests you have to relaunch the test process (no hot reload for tests actually)