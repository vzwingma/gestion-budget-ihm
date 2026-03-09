# Copilot Instructions – gestion-budget-ihm

This is the **React/TypeScript frontend** of the Budget Management application. The backend is the companion repo [`gestion-budget-serverless`](../gestion-budget-serverless) (Quarkus microservices on AWS Lambda).

## Build, Test & Lint

```bash
# Install dependencies
npm ci --ignore-scripts

# Start with a specific environment
npm run start:dev     # uses .env.dev
npm run start:qua     # uses .env.qua
npm run start:prod    # uses .env.prod

# Build for production
npm run build         # minifies CSS then runs react-scripts build

# Run all tests
npm run test

# Run tests with coverage (CI mode, no watch)
npm run test:coverage

# Run a single test file
npx react-scripts test --watchAll=false src/path/to/Component.test.tsx

# Lint
npm run lint
```

Environment files follow `.env.model` as a template. Each `.env.*` file defines:
- `REACT_APP_CONFIG_URL_COMPTES`, `_OPERATIONS`, `_PARAMS`, `_UTILISATEURS` – microservice URLs
- `REACT_APP_CONFIG_OIDC_*` – Google OIDC credentials
- `REACT_APP_CONFIG_API_KEY` – AWS API Gateway key sent as `X-Api-Key` on every request

## Architecture

### Layers
```
src/main/
├── Components/      # React UI components (TSX)
├── Models/          # TypeScript data models + React Context
├── Services/        # HTTP client + auth token management
└── Utils/           # Constants, enums, utility functions
```

### Data flow
1. **Auth** – `react-oidc-context` handles Google OAuth. `Auth.service.ts` stores and retrieves the token.
2. **HTTP** – All backend calls go through `ClientHTTP.service.ts` which attaches `X-Api-Key` and `Authorization: Bearer <token>` headers. URLs use `{{}}` as positional placeholders, replaced via the `params` array argument.
3. **State** – Global state lives in `BudgetContextProvider.tsx` (React Context). Local UI state uses `useState`/`useMemo`/`useCallback` in functional components.
4. **Routing** – `HashRouter` from `react-router-dom@7`.

### Component conventions
- All components are **functional** with `React.FC<Props>` typing.
- Props interfaces are co-located in `Components.props.ts`.
- Feature folders mirror domain names: `analyses/`, `budgets/`, `operations/`.
- Sub-components for a page live in a `subcomponents/` sub-folder; action buttons go in `actions/`.
- Material-UI (`@mui/material`) is the sole UI library. Use `Box`/`Grid` for layout; `useMediaQuery`/`useTheme` for responsive behaviour.

### Key enums & constants
- `AppTechEnums.constants.ts` – `API_GW_ENUM` (API gateway key, env var references)
- `AppBusinessEnums.constants.ts` – operation types, statuses, periodicities

## Environment & Deployment
- CI builds the `qua` environment and deploys to an S3 bucket (`budget-app-ihm-qua`) with CloudFront invalidation.
- Release tags trigger a `prod` build and deploy.
- SonarCloud quality gate runs after lint + tests; coverage is read from `coverage/lcov.info`.
