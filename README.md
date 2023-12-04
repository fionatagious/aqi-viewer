# Air Quality Index (AQI) Viewer

This repository is the codebase for an Air Quality Index (AQI) Viewer, which displays air quality data, collected and measured at monitoring stations around the world. To build the viewer, I used a free and publicly accessible [Real-time Air Quality Data Feed](https://aqicn.org/json-api/doc/), a JSON API provided by the World Air Quality Index project.

## Environment Setup

### Environment Variables

1. If you do not already have a private API key, request one [here](https://aqicn.org/data-platform/token/).
2. Create a `.env` and pass the token as a string to `AQICN_TOKEN`.

```
API_HOST="https://api.waqi.info/feed/"
AQICN_TOKEN="example API key"
```

### Install needed packages and dependencies

1. If you already have Node installed, check the installed version by running `node -v` and seeing that it returns `v18.18.0`. If you need to install it, and if you are [using nvm](https://github.com/nvm-sh/nvm#installing-and-updating), run:

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

   ...or if you are [using asdf](https://asdf-vm.com/guide/getting-started.html#_4-install-a-plugin), run:

   ```bash
   asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
   ```

   ```bash
   asdf install nodejs 14.17.6
   ```

2. Install package.json dependencies into the `node_modules/` directory
   ```bash
   npm install
   ```

## Running the application

Run development server:

```bash
npm run dev
```

or

```bash
next dev
```

## Running tests with Cypress

Tests are located in a single file: `cypress/e2e/app.cy.js`

To run tests, run:

```bash
npx cypress run --spec cypress/e2e/app.cy.js
```

Note: Cypress waits until the dev server is accessible before running tests, so be sure to start the dev server with `npm run dev` before running tests.

Alternatively, you can run tests in Cypress desktop app:

```bash
npx cypress open
```

Click on E2E testing, choose your preferred browser, and click "Start E2E Testing."
