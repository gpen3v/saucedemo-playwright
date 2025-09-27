# SauceDemo Playwright Test Automation

This project contains automated tests for the SauceDemo website using Playwright with TypeScript.

## Project Structure

```
├── .github/workflows      # GitHub Actions workflow configurations
├── playwright/.auth      # Authentication states storage
├── pageObjects/          # Page Object Model implementations
│   ├── global.ts        # Common components (Header, Footer, Login)
│   ├── productsList.ts  # Products list page objects
│   ├── productItem.ts   # Product details page objects
│   └── cart.ts         # Cart and checkout page objects
├── tests/               # Test suites
│   ├── e2e/           # End-to-end test scenarios
│   ├── auth/          # Authentication setup tests
│   └── standardUser/  # Standard user specific tests
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
npx playwright test tests/e2e/VariousCases.spec.ts
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

### GitHub Secrets Required:

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

## Best Practices

1. Use Page Object Model for better maintainability
2. Keep test data in environment variables
3. Use authentication states for faster test execution
4. Implement soft assertions where appropriate
5. Follow proper timeout handling
6. Maintain clear test descriptions
7. Group related tests in describes
8. Use beforeEach for common setup

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests locally
4. Submit a pull request

## Troubleshooting

### Common Issues:

1. Authentication failures:
   - Verify .env file configuration
   - Check auth state storage

2. Timeout errors:
   - Check network connectivity
   - Verify timeout settings in playwright.config.ts

3. Test flakiness:
   - Review wait conditions
   - Check for proper assertions
   - Verify element selectors