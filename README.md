# Altario Fullstack Application

This repository contains a fullstack application developed for Altario. The application consists of a TypeScript-based Fastify backend API and a React frontend user interface.

## Description

The Altario Fullstack Application is a modern web application that demonstrates the integration of a Fastify backend with a React frontend. It includes the following features:

1. Main Application / Generator Page - A generator page with a 10x10 grid of random alphabetic characters and a secret code.
    - Grid calculation performed on the backend and exposed via an API endpoint.
    - 2-digit secret code display, updated with each grid refresh.
    - Bias/Weighting factor input for influencing character distribution in the grid.
    - Payments Page - A page to manage and display payments.
    
2. Real-time Sync (Bonus) - Real-time data synchronization across multiple clients.

3. CI/CD - Continuous Integration and Continuous Deployment (Bonus)

## Prerequisites

Before running the application, ensure you have the following installed on your system:

- Node.js (version 12+)
- npm (usually comes with Node.js)
- Git
- React with TypeScript and Vite

## Running the Application

Follow these steps to run the application:

1. Clone the repository:
   ```
   git clone https://github.com/helderpgoncalves/altario-fullstack.git
   cd altario-fullstack
   ```

2. Choose the feature you want to run:

   ### Main Application
   
   a. Switch to the `feat/helder-goncalves` branch:
      ```
      git checkout feat/helder-goncalves
      ```
   
   ### Real-time Sync Feature (Bonus)
   
   a. Switch to the `feat/real-time-sync` branch:
      ```
      git checkout feat/real-time-sync
      ```

   ### CI/CD Feature
   
   a. Switch to the `feat/ci-cd` branch:
      ```
      git checkout feat/ci-cd
      ```

3. Set up the backend:
   ```
   cd backend
   npm install
   npm run dev
   ```
   The backend will start running on `http://localhost:3000`.

4. Open a new terminal window, navigate to the project root, and set up the frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start running on `http://localhost:5173`.

5. Open your web browser and navigate to `http://localhost:5173` to access the application.

## Features

### Generator Page

- 10x10 grid filled with random alphabetic characters, refreshed every second.
- Start button to initiate the generator.
- Grid calculation performed on the backend and exposed via an API endpoint.
- 2-digit secret code display, updated with each grid refresh.
- Bias/Weighting factor input for influencing character distribution in the grid.

### Payments Page
- Displays the current secret code.
- Form to add payment name and amount.
- Payments list with assigned codes and grid snapshots.
- Data persistence through backend API.

### Real-time Sync (Bonus)

- WebSocket implementation for real-time updates across clients.
- Synchronized grid and payment list updates.
- Visual indicators for real-time changes.

### CI/CD (Bonus)

This project uses GitHub Actions for Continuous Integration and Continuous Deployment.

#### Continuous Integration

The CI workflow runs on every push to the `main` branch, as well as on pull requests to this branch. It performs the following tasks:

1. Runs backend tests
2. Runs backend linter
3. Runs frontend linter

#### Continuous Deployment

The CD workflow runs on every push to the `main` branch. It performs the following tasks:

1. Builds the backend application
2. Deploys the application to the production server

To set up CD, you need to add a `DEPLOY_KEY` secret in your GitHub repository settings.

## API Endpoints

- GET /api/grid - Retrieve the current grid
- GET /api/payments - Retrieve the list of payments
- POST /api/payments - Add a new payment
- GET /api/payments/:id - Retrieve a payment by ID
- DELETE /api/payments/:id - Delete a payment by ID
- PUT /api/payments/:id - Update a payment by ID

## Local Development with Docker

To run the application locally using Docker:

1. Build and run the containers:  
    ```
    docker compose up --build
    ```

2. Access the application via `http://localhost:5173`.
