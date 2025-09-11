# Cinema Tickets 

A Node.js implementation of a cinema ticket purchasing system with comprehensive business rule validation and test coverage.

## 📋 Overview

This project implements a `TicketService` that handles cinema ticket purchases with the following business rules:

- **3 Ticket Types**: Adult (£25), Child (£15), Infant (£0)
- **Maximum 25 tickets** per purchase
- **Child/Infant tickets** require at least one Adult ticket
- **Infant tickets** must be ≤ number of Adult tickets
- **Infants don't get seats** (sit on adult's lap)
- **Account validation** (positive integer > 0)

## 🏗️ Project Structure

```
cinema-tickets/
├── src/
│   ├── pairtest/
│   │   ├── TicketService.js              # Main service class
│   │   ├── lib/
│   │   │   ├── TicketTypeRequest.js      # Immutable ticket request
│   │   │   └── InvalidPurchaseException.js # Custom exception
│   │   └── constants/
│   │       └── TicketConstants.js        # Business constants
│   └── thirdparty/
│       ├── paymentgateway/
│       │   └── TicketPaymentService.js   # Payment service (external)
│       └── seatbooking/
│           └── SeatReservationService.js # Seat service (external)
├── test/
│   ├── TicketService.test.js             # Service tests
│   └── TicketTypeRequest.test.js         # Request tests
├── package.json
├── jest.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.9.0
- npm

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/ogbiyoyosky/cinema-tickets>
cd cinema-tickets
```

2. Install dependencies:
```bash
npm install
```

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```


## 🏛️ Architecture

### Design Patterns

- **Dependency Injection**: Services injected via constructor
- **Strategy Pattern**: Modular validation strategies with orchestrator
- **Immutable Objects**: TicketTypeRequest cannot be modified
- **Private Methods**: All validation logic is private
- **Custom Exceptions**: Specific error types for different failures
- **Structured Logging**: Pino-based logging with context support
- **Configuration Management**: Environment-based configuration

### Key Classes

#### TicketService
- **Public API**: Only `purchaseTickets()` method
- **Private Methods**: All validation and calculation logic
- **Dependencies**: Payment and seat reservation services
- **Logging**: Structured logging with Pino
- **Configuration**: Environment-based configuration

#### TicketTypeRequest
- **Immutable**: Once created, cannot be modified
- **Validation**: Type and quantity validation on construction
- **Getters**: Access to type and quantity

#### Logger (Pino-based)
- **Structured Logging**: JSON-formatted logs with timestamps
- **Context Support**: Child loggers with merged context
- **Log Levels**: Trace, debug, info, warn, error, fatal
- **Development Mode**: Pretty-printed logs in development
- **Production Ready**: High-performance JSON logging

## 🔧 Configuration

### Jest Configuration
- **Test Environment**: Node.js
- **Transform**: Babel for ES6+ support
- **Coverage**: Excludes third-party services
- **Reports**: Text, LCOV, and HTML formats

### Babel Configuration
- **Preset**: @babel/preset-env
- **Target**: Node.js environment

## 📝 Business Rules

| Rule | Description | Example |
|------|-------------|---------|
| Account ID | Must be positive integer > 0 | ✅ 123, ❌ 0, ❌ -1 |
| Max Tickets | Maximum 25 tickets per purchase | ✅ 25, ❌ 26 |
| Adult Required | Child/Infant tickets need Adult | ✅ 1A+1C, ❌ 1C only |
| Infant Limit | Infant tickets ≤ Adult tickets | ✅ 2A+1I, ❌ 1A+2I |
| Pricing | Adult £25, Child £15, Infant £0 | 2A+1C+1I = £65 |
| Seating | Infants don't get seats | 2A+1C+1I = 3 seats |



## 📈 Testing Strategy

### Test-Driven Development (TDD)
- Tests written before implementation
- Comprehensive business rule coverage
- Edge case validation
- Error scenario testing

![Image 11-09-2025 at 10 48](https://github.com/user-attachments/assets/00c19dd8-3018-493a-859f-7ae4bea21565)
