# Medical Blockchain API Documentation

## Base URL
```
http://localhost:4000
```

## Endpoints

### 0. Get Available Accounts
Get all available Ethereum accounts from Ganache.

**Endpoint:** `GET /api/accounts`

**Example using curl:**
```bash
curl http://localhost:4000/api/accounts
```

**Success Response:**
```json
{
    "success": true,
    "accounts": [
        "0xF7e9bFCcf873E7CC84302A7dB3FB96F3FA775D93",
        "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
        "0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C",
        ...
    ]
}
```

### 1. Register a New Patient
Register a new patient in the blockchain.

**Endpoint:** `POST /api/patients`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "John Doe",
    "address": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"  // Optional: Use a different account
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:4000/api/patients \
-H "Content-Type: application/json" \
-d "{\"name\":\"John Doe\", \"address\":\"0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f\"}"
```

**Success Response:**
```json
{
    "success": true,
    "transaction": "0xaa9692a62b73060899855bb73342311c0f946b30f9342fa73e1b0e5a8293a665",
    "patientAddress": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
}
```

**Common Errors:**
```json
{
    "success": false,
    "error": "Invalid Ethereum address format"
}
```
```json
{
    "success": false,
    "error": "Address not found in Ganache. Please use one of the available accounts.",
    "availableAccounts": ["0x...", "0x...", ...]
}
```
```json
{
    "success": false,
    "error": "Returned error: VM Exception while processing transaction: revert Patient already registered"
}
```

### 2. Record Temperature
Record a patient's temperature in the blockchain.

**Endpoint:** `POST /api/temperature`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "temperature": 37.5,
    "address": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"  // Optional: Use a different account
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:4000/api/temperature \
-H "Content-Type: application/json" \
-d "{\"temperature\":37.5, \"address\":\"0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f\"}"
```

**Success Response:**
```json
{
    "success": true,
    "transaction": "0x07b3edce7313a894f065082991ecc8c9f664521317b69d1652afc555fb325f92",
    "patientAddress": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"
}
```

### 3. Get Patient Data
Retrieve all temperature records for a specific patient.

**Endpoint:** `GET /api/patients/:address`

**Parameters:**
- `:address` - Ethereum address of the patient

**Example using curl:**
```bash
curl http://localhost:4000/api/patients/0xF7e9bFCcf873E7CC84302A7dB3FB96F3FA775D93
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "name": "John Doe",
        "temperatures": [37.5, 36.8],
        "timestamps": [1732640116, 1732640120]
    }
}
```

## Using with Postman

### 1. Register Patient
- Method: POST
- URL: `http://localhost:4000/api/patients`
- Headers: 
  - Key: `Content-Type`
  - Value: `application/json`
- Body (raw JSON):
```json
{
    "name": "John Doe",
    "address": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"  // Optional: Use a different account
}
```

### 2. Record Temperature
- Method: POST
- URL: `http://localhost:4000/api/temperature`
- Headers: 
  - Key: `Content-Type`
  - Value: `application/json`
- Body (raw JSON):
```json
{
    "temperature": 37.5,
    "address": "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f"  // Optional: Use a different account
}
```

### 3. Get Patient Data
- Method: GET
- URL: `http://localhost:4000/api/patients/0xF7e9bFCcf873E7CC84302A7dB3FB96F3FA775D93`
- No headers or body required

## Error Handling
All endpoints return error responses in the following format:
```json
{
    "success": false,
    "error": "Error message description"
}
```

## Important Notes
1. Make sure Ganache is running on port 7545
2. The API server must be running (use `node server.js` in the api directory)
3. Temperature values should be in Celsius
4. Patient addresses are case-sensitive
5. Use the `/api/accounts` endpoint to get valid addresses
6. Each address can only register as a patient once
7. Only registered patients can record temperatures