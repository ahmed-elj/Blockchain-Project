const express = require('express');
const Web3 = require('web3');
const cors = require('cors');
const contract = require('../build/contracts/MedicalRecord.json');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to local blockchain
const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = '0x3580a4761369Cfefd4E741142cb466CEF391Aa64'; // Your deployed contract address
const medicalRecord = new web3.eth.Contract(contract.abi, contractAddress);

// Get accounts
let accounts;
web3.eth.getAccounts().then(acc => {
    accounts = acc;
    console.log('Available accounts:', accounts);
});

// Helper function to validate Ethereum address
function isValidAddress(address) {
    return web3.utils.isAddress(address);
}

// Helper function to check if address exists in Ganache
async function isExistingAccount(address) {
    const allAccounts = await web3.eth.getAccounts();
    return allAccounts.map(a => a.toLowerCase()).includes(address.toLowerCase());
}

// Get all available accounts
app.get('/api/accounts', async (req, res) => {
    try {
        const allAccounts = await web3.eth.getAccounts();
        res.json({
            success: true,
            accounts: allAccounts
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Register a new patient
app.post('/api/patients', async (req, res) => {
    try {
        const { name, address } = req.body;
        const fromAddress = address || accounts[0];

        // Validate address format
        if (!isValidAddress(fromAddress)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Ethereum address format"
            });
        }

        // Check if address exists in Ganache
        if (!(await isExistingAccount(fromAddress))) {
            return res.status(400).json({
                success: false,
                error: "Address not found in Ganache. Please use one of the available accounts.",
                availableAccounts: accounts
            });
        }

        const result = await medicalRecord.methods.registerPatient(name)
            .send({ from: fromAddress, gas: 200000 });
        res.json({
            success: true,
            transaction: result.transactionHash,
            patientAddress: fromAddress
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Record temperature
app.post('/api/temperature', async (req, res) => {
    try {
        const { temperature, address } = req.body;
        const fromAddress = address || accounts[0];

        // Validate address
        if (!isValidAddress(fromAddress)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Ethereum address format"
            });
        }

        // Check if address exists
        if (!(await isExistingAccount(fromAddress))) {
            return res.status(400).json({
                success: false,
                error: "Address not found in Ganache. Please use one of the available accounts.",
                availableAccounts: accounts
            });
        }

        // Convert temperature to integer (multiply by 100)
        const tempInt = Math.round(parseFloat(temperature) * 100);
        const result = await medicalRecord.methods.recordTemperature(tempInt)
            .send({ from: fromAddress, gas: 200000 });
        res.json({
            success: true,
            transaction: result.transactionHash,
            patientAddress: fromAddress
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Get patient data
app.get('/api/patients/:address', async (req, res) => {
    try {
        const { address } = req.params;

        // Validate address
        if (!isValidAddress(address)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Ethereum address format"
            });
        }

        const data = await medicalRecord.methods.getPatientData(address).call();
        
        // Convert temperatures back to decimal format
        const temperatures = data.temperatures.map(temp => temp / 100);
        
        res.json({
            success: true,
            data: {
                name: data.name,
                temperatures: temperatures,
                timestamps: data.timestamps.map(ts => parseInt(ts))
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 