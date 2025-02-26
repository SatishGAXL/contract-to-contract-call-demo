# Contract-to-Contract Call Demo on Algorand

This project demonstrates how to implement and interact with smart contracts that can call each other on the Algorand blockchain. It includes two smart contracts and a React frontend for interaction.

## Main Project Structure

```
├── projects/
│   ├── starter_tealscript_react-contracts/
│   │   ├── contracts/
│   │   │   ├── ContractA.algo.ts
│   │   │   ├── ContractB.algo.ts
│   │   │   └── demo.ts
│   └── starter_tealscript_react-frontend/
│       └── src/
│           └── App.tsx
```

## Smart Contracts Overview

### ContractA
- A simple contract that stores and manages a string value in its global state
- Provides methods to set and get the stored data

### ContractB
- Acts as an intermediary contract that calls ContractA's methods
- Stores the parent contract (ContractA) ID
- Provides wrapper methods to interact with ContractA

## Features

- Contract-to-contract communication using TEALScript
- Global state management
- Frontend interaction with smart contracts
- Transaction explorer integration

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/SatishGAXL/contract-to-contract-call-demo.git
cd contract-to-contract-call-demo
```
2. Install dependencies in both contract and frontend projects:
```bash
cd projects/starter_tealscript_react-contracts
npm install

cd ../starter_tealscript_react-frontend
npm install
```

3. Configure environment variables:
   - Copy `.env.sample` files in both directories
   - Update with your Algorand node details and wallet mnemonic

## Running the Demo

1. Deploy the contracts:
```bash
cd projects/starter_tealscript_react-contracts
npx tsx demo.ts
```

2. Update the frontend .env with deployed contract IDs
3. Start the frontend:
```bash
cd ../starter_tealscript_react-frontend
npm run development
```

## Frontend Features

- Get Data: Retrieves the stored string from ContractA through ContractB
- Set Data: Updates the stored string in ContractA through ContractB
- Transaction tracking with explorer links
- Real-time status updates

## Technical Implementation

The contract-to-contract call is implemented using TEALScript's `sendMethodCall` feature. ContractB acts as a proxy that forwards calls to ContractA while maintaining its own application ID reference.

Example flow:
1. User interacts with frontend
2. Frontend calls ContractB
3. ContractB forwards the call to ContractA
4. ContractA executes the requested operation
5. Result is returned through the chain back to the frontend

## Network Configuration

The demo is configured to run on Algorand TestNet. You can modify the environment variables to point to different networks:

- ALGOD_TOKEN
- ALGOD_SERVER
- ALGOD_PORT
- WALLET_MNEMONIC
- CONTRACT_A_ID
- CONTRACT_B_ID