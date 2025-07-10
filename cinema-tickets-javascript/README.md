Application ID number: 14451828 
Campaign number: 406891

# Cinema Tickets

This is a Node.js implementation of the cinema tickets exercise for the role of JavaScript/Node.js Engineer.


## Features

- Implements all mentioned and identified business rules for cinema ticket purchasing
- Validates all constraints: maximum ticket limit, account ID checks, ticket combinations
- Integrates with the provided external services:
    - 'TicketPaymentService' for payment handling
    - 'SeatReservationService' for seat booking
- Includes unit and integration tests using Jest
- Robust error handling for invalid scenarios
- Includes logging for better traceability and validation outcome


## How to Run

From the root of the project: 

```bash
npm install
node run.js
```
- Test various scenarios by modifying ticket request values in run.js

## How to test

```bash
npm test
```
- Test coverage for TicketService.js is 97.56%. 
- Run the following command for checking test coverage.

```bash
npx jest --coverage --collectCoverageFrom="src/pairtest/TicketService.js"
```

## Assumptions

- All account IDs > 0 are valid and have sufficient funds.
- External services are reliable and stable.
- All ticket types (except infant) count towards the total 25 ticket limit.
- Infants require adult supervision but don't reserve a seat.
