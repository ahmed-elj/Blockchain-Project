# Medical Blockchain API Documentation

## Base URL
```
http://localhost:4000
```

## Endpoints

### 1. Get Available Accounts
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
        "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f",
        "0xCD1E94a5DFa39DF24E3D37D7461AEceF6f146aa8",
        ...
    ]
}
```

### 2. Register a New Patient
Register a new patient in the blockchain.

**Endpoint:** `POST /api/patients`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "John Doe",                           // Required
    "address": "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f",  // Required
    "medicalFolder": "FOLDER123",                 // Optional
    "phoneNumber": "123-456-7890",               // Optional
    "email": "john@example.com",                 // Optional
    "age": 30,                                   // Optional
    "gender": "Male",                            // Optional
    "medicalDescription": "Patient history: None" // Optional
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:4000/api/patients \
-H "Content-Type: application/json" \
-d '{
    "name": "John Doe",
    "address": "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f",
    "medicalFolder": "FOLDER123",
    "phoneNumber": "123-456-7890",
    "email": "john@example.com",
    "age": 30,
    "gender": "Male",
    "medicalDescription": "Patient history: None"
}'
```

**Success Response:**
```json
{
    "success": true,
    "transaction": "0xaa9692a62b73060899855bb73342311c0f946b30f9342fa73e1b0e5a8293a665",
    "patientAddress": "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f",
    "patientData": {
        "name": "John Doe",
        "medicalFolder": "FOLDER123",
        "phoneNumber": "123-456-7890",
        "email": "john@example.com",
        "age": 30,
        "gender": "Male",
        "medicalDescription": "Patient history: None"
    }
}
```

**Common Errors:**
```json
{
    "success": false,
    "error": "Name and address are required"
}
```
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
    "error": "Patient already registered"
}
```

### 3. Record Temperature
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
    "address": "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:4000/api/temperature \
-H "Content-Type: application/json" \
-d '{
    "temperature": 37.5,
    "address": "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f"
}'
```

**Success Response:**
```json
{
    "success": true,
    "transaction": "0x07b3edce7313a894f065082991ecc8c9f664521317b69d1652afc555fb325f92",
    "patientAddress": "0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f"
}
```

### 4. Get Patient Data
Retrieve all data for a specific patient.

**Endpoint:** `GET /api/patients/:address`

**Parameters:**
- `:address` - Ethereum address of the patient

**Example using curl:**
```bash
curl http://localhost:4000/api/patients/0x7aA669f766bD30627EAa9C8Aab04b4D69BCDB79f
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "name": "John Doe",
        "medicalFolder": "FOLDER123",
        "phoneNumber": "123-456-7890",
        "email": "john@example.com",
        "age": 30,
        "gender": "Male",
        "medicalDescription": "Patient history: None",
        "temperatures": [37.5, 36.8],
        "timestamps": [1732640116, 1732640120]
    }
}
```

### 5. Search Patient
Search for a patient by name and folder number.

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `name` - Patient's name
- `folderNumber` - Medical folder number

**Example using curl:**
```bash
curl "http://localhost:4000/api/search?name=John%20Doe&folderNumber=FOLDER123"
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "name": "John Doe",
        "medicalFolder": "FOLDER123",
        "age": 30,
        "gender": "Male",
        "email": "john@example.com",
        "phoneNumber": "123-456-7890",
        "medicalDescription": "Patient history: None",
        "temperatures": [37.5, 36.8],
        "timestamps": [1732640116, 1732640120]
    }
}
```

## Using with Postman

Import the provided `Medical_Blockchain.postman_collection.json` file into Postman for easy testing of all endpoints.

## Important Notes
1. Make sure Ganache is running on port 7545
2. The API server must be running (use `node server.js` in the api directory)
3. Temperature values should be in Celsius
4. Patient addresses are case-sensitive
5. Use the `/api/accounts` endpoint to get valid addresses
6. Each address can only register as a patient once
7. Only registered patients can record temperatures
8. All optional fields will use empty strings or 0 as default values if not provided