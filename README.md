# Bank System

A comprehensive banking application designed for managing financial transactions efficiently.

## Features
- User account management (registration, login, logout)
- Account balance inquiry
- Fund transfers between accounts
- Transaction history tracking
- Multi-currency support

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/milian-rm/bank_system.git
   cd bank_system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

## API Endpoints
- `POST /api/register`: Create a new user account
- `POST /api/login`: Authenticate user and receive a token
- `GET /api/account/:id/balance`: Retrieve account balance
- `POST /api/transfer`: Transfer funds between accounts
- `GET /api/transactions`: Get transaction history

## Technologies
- Node.js
- Express.js
- MongoDB
- JWT (JSON Web Tokens)

## Security Measures
- Password hashing using bcrypt
- JWT for secure user authentication
- Input validation to prevent SQL injection and XSS attacks

## Contribution Guidelines
1. Fork the repository
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/YourFeature`
6. Create a pull request

## License
This project is licensed under the MIT License.