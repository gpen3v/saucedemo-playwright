# SauceDemo Playwright Test Automation

This project contains automated tests for the SauceDemo website using Playwright with TypeScript.

## Project Structure

```
├── .github/workflows      # GitHub Actions workflow configurations
├── playwright/.auth      # Authentication states storage and .env file
├── pageObjects/          # Page Object Model implementations
│   ├── global.ts        # Common components (Header, Footer, Login)
│   ├── productsList.ts  # Products list page objects
│   ├── productItem.ts   # Product details page objects
│   └── cart.ts         # Cart and checkout page objects
├── tests/               # Test suites
│   ├── e2e/           # End-to-end test scenarios
│       └── Screenshots # Saved screenshots for visual comparisons     
│   ├── auth/          # Authentication setup tests
│   └── standardUser/  # Standard user specific tests
├── utils/             # Place for files for custom options, methods and helping funcitons
│   └── option.ts.     # Custom option for setting different user in every project 
└── playwright.config.ts # Playwright configuration
```

## Prerequisites

- Node.js (LTS version)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gpen3v/saucedemo-playwright.git
cd saucedemo-playwright
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install --with-deps
```

## Configuration

1. Create a `.env` file in `playwright/.auth/` directory with the needed content:

## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run a specific test file:
```bash
npx playwright test tests/e2e/CompletePurchaseFlow.spec.ts
```

### Run a specific test by its name:
```bash
npx playwright test  -g "Display of Products"
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests with UI mode:
```bash
npx playwright test --ui
```

## CI/CD Integration

The project uses GitHub Actions for continuous integration. The workflow:
- Runs tests daily at 01:00 Bulgarian time
- Can be triggered manually through workflow_dispatch
- Uploads test reports as artifacts
- Uses GitHub Secrets for environment variables

## Test Reports

After test execution, reports are available in the following locations:

- Local: `playwright-report/` directory
- CI/CD: Downloadable artifacts in GitHub Actions

## Page Object Model

The project follows the Page Object Model pattern for better maintainability:

- `global.ts`: Common components like Header, Footer, and Login form
- `productsList.ts`: Products list page functionality including sorting
- `productItem.ts`: Individual product details page
- `cart.ts`: Shopping cart and checkout process

## Summary

### Covered Test Cases - 48

### Projects in Playwright Configuration - 6

- Project for getting authentication state for every user. This way every test reuses the authentication states without to login every time
- Separate projects for every user to have running tests in paralel.
- Project for restricted access - anonymous and locked-out user.

### Test scenarios
- Authentication
- Complete Purchase flow
- User journeys for various validations and edge cases, screenshot comparison and a performance check
- Restricted access for anonymous and locked-out user



