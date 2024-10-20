# altario-fullstack

# Grid Generator App

## CI/CD

This project uses GitHub Actions for Continuous Integration and Continuous Deployment.

### Continuous Integration

The CI workflow runs on every push to the `main` branch, as well as on pull requests to this branch. It performs the following tasks:

1. Runs backend tests
2. Runs backend linter
3. Runs frontend linter

### Continuous Deployment

The CD workflow runs on every push to the `main` branch. It performs the following tasks:

1. Builds the backend application
2. Deploys the application to the production server

To set up CD, you need to add a `DEPLOY_KEY` secret in your GitHub repository settings.

## Local Development

To run the application locally using Docker:

1. Build and run the containers:
   ```
   docker-compose up --build
   ```

The backend will be available at `http://localhost:3000`.
The frontend will be available at `http://localhost:5173`.

## Running Tests

To run the backend tests:

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the tests:
   ```
   npm test
   ```

## Linting

To run the linters:

1. For the backend:
   ```
   cd backend
   npm run lint
   ```

2. For the frontend:
   ```
   cd frontend
   npm run lint
   ```
