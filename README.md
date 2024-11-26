# Medical Blockchain

A blockchain-based medical record system built on Ethereum for storing patient temperatures.

## Features

- Patient registration
- Temperature recording
- Historical temperature data retrieval
- Blockchain-based data integrity

## Prerequisites

1. Install Truffle globally:
```bash
npm install -g truffle
```

2. Install and run Ganache (local blockchain)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Compile the smart contract:
```bash
truffle compile
```

3. Deploy the contract:
```bash
truffle migrate
```

To deploy to a specific network:
```bash
truffle migrate --network development
```

## Smart Contract Functions

1. `registerPatient(string name)`: Register a new patient
2. `recordTemperature(uint256 temperature)`: Record a new temperature reading
3. `getPatientData(address patientAddress)`: Get all temperature readings for a patient

## Testing

Run the test suite:
```bash
truffle test
```

## Security

- Each patient can only access their own records
- All data is stored on the Ethereum blockchain
- Immutable record keeping