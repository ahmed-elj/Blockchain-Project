const express = require("express");
const Web3 = require("web3");
const cors = require("cors");
const contract = require("../build/contracts/MedicalRecord.json");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to local blockchain
const web3 = new Web3("http://127.0.0.1:7545");

// After initializing the contract
console.log("Contract ABI loaded:", contract.abi ? "Yes" : "No");

// Initialize accounts first
let accounts;
let medicalRecord;

// After the web3 initialization and before the accounts initialization
// const contractAddress = ""; // You'll need to fill this after deployment
// medicalRecord = new web3.eth.Contract(
//   contract.abi,
//   contractAddress
// );

// Modify the initializeContract function
async function initializeContract() {
  try {
    // Get the network ID
    const networkId = await web3.eth.net.getId();
    console.log("Current network ID:", networkId);
    
    // Get the deployed contract address from the contract artifact
    const deployedNetwork = contract.networks[networkId];
    
    if (!deployedNetwork) {
      throw new Error(`Contract not deployed to detected network (ID: ${networkId})`);
    }

    // Create new contract instance
    const contractInstance = new web3.eth.Contract(
      contract.abi,
      deployedNetwork.address
    );

    // Verify the contract exists at the address
    const code = await web3.eth.getCode(deployedNetwork.address);
    if (code === '0x' || code === '0x0') {
      throw new Error(`No contract code found at ${deployedNetwork.address}`);
    }

    console.log("Contract initialized at:", deployedNetwork.address);
    return contractInstance;
  } catch (error) {
    console.error("Failed to initialize contract:", error);
    throw error;
  }
}

// Modify the initialize function to handle errors better
async function initialize() {
  try {
    accounts = await web3.eth.getAccounts();
    console.log("Available accounts:", accounts);

    medicalRecord = await initializeContract();
    
    // Test contract connection with a simple call
    try {
      const exists = await medicalRecord.methods.patients(accounts[0]).call();
      console.log("Contract connection test successful:", exists);
    } catch (error) {
      console.error("Contract connection test failed:", error.message);
      // Throw the error to prevent the server from starting with an invalid contract
      throw new Error("Contract connection test failed - please check deployment");
    }
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1); // Exit if initialization fails
  }
}

// Call the initialization function
initialize();

// Helper function to validate Ethereum address
function isValidAddress(address) {
  return web3.utils.isAddress(address);
}

// Helper function to check if address exists in Ganache
async function isExistingAccount(address) {
  const allAccounts = await web3.eth.getAccounts();
  return allAccounts
    .map((a) => a.toLowerCase())
    .includes(address.toLowerCase());
}

// Get all available accounts
app.get("/api/accounts", async (req, res) => {
  try {
    const allAccounts = await web3.eth.getAccounts();
    res.json({
      success: true,
      accounts: allAccounts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Register a new patient
app.post("/api/patients", async (req, res) => {
  try {
    const {
      name,
      address,
      medicalFolder,
      phoneNumber,
      email,
      age,
      gender,
      medicalDescription
    } = req.body;
    
    // Validate required fields
    if (!name || !address) {
      return res.status(400).json({
        success: false,
        error: "Name and address are required"
      });
    }

    // Validate optional fields or set defaults
    const patientData = {
      name,
      medicalFolder: medicalFolder || "",
      phoneNumber: phoneNumber || "",
      email: email || "",
      age: age || 0,
      gender: gender || "",
      medicalDescription: medicalDescription || ""
    };

    const fromAddress = address;

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

    console.log("Registering patient with params:", {
      ...patientData,
      fromAddress
    });

    const result = await medicalRecord.methods
      .registerPatient(
        patientData.name,
        patientData.medicalFolder,
        patientData.phoneNumber,
        patientData.email,
        patientData.age,
        patientData.gender,
        patientData.medicalDescription
      )
      .send({ from: fromAddress, gas: 3000000 });

    console.log("Registration result:", result);

    res.json({
      success: true,
      transaction: result.transactionHash,
      patientAddress: fromAddress,
      patientData
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Record temperature
app.post("/api/temperature", async (req, res) => {
  try {
    const { temperature, address } = req.body;
    const fromAddress = address || accounts[0];

    // Validate address
    if (!isValidAddress(fromAddress)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address format",
      });
    }

    // Check if address exists
    if (!(await isExistingAccount(fromAddress))) {
      return res.status(400).json({
        success: false,
        error:
          "Address not found in Ganache. Please use one of the available accounts.",
        availableAccounts: accounts,
      });
    }

    // Convert temperature to integer (multiply by 100)
    const tempInt = Math.round(parseFloat(temperature) * 100);
    const result = await medicalRecord.methods
      .recordTemperature(tempInt)
      .send({ from: fromAddress, gas: 200000 });
    res.json({
      success: true,
      transaction: result.transactionHash,
      patientAddress: fromAddress,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// Get patient data
app.get("/api/patients/:address", async (req, res) => {
  try {
    const { address } = req.params;

    console.log("Fetching data for address:", address);

    // Validate address
    if (!isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address format"
      });
    }

    // Check if address exists in Ganache
    if (!(await isExistingAccount(address))) {
      return res.status(400).json({
        success: false,
        error: "Address not found in Ganache"
      });
    }

    // First check if patient exists
    const exists = await medicalRecord.methods.patients(address).call();
    console.log("Patient exists check:", exists);

    if (!exists.exists) {
      return res.status(404).json({
        success: false,
        error: "Patient not registered"
      });
    }

    // Get patient data from smart contract
    const data = await medicalRecord.methods.getPatientData(address).call();
    console.log("Raw patient data:", data);

    // Convert temperatures back to decimal format
    const temperatures = data.temperatures.map(temp => parseInt(temp) / 100);

    res.json({
      success: true,
      data: {
        name: data.name,
        medicalFolder: data.medicalFolder,
        phoneNumber: data.phoneNumber,
        email: data.email,
        age: parseInt(data.age),
        gender: data.gender,
        medicalDescription: data.medicalDescription,
        temperatures: temperatures,
        timestamps: data.timestamps.map(ts => parseInt(ts))
      }
    });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Error fetching patient data",
      details: error.stack
    });
  }
});

// Add this endpoint to your existing server.js
app.get("/api/search", async (req, res) => {
  try {
    const { name, folderNumber } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Name is required for search"
      });
    }

    const accounts = await web3.eth.getAccounts();
    const sender = accounts[0];

    try {
      // Always pass a string, even if empty
      const searchFolderNumber = folderNumber || "";
      
      const result = await medicalRecord.methods
        .searchPatient(name, searchFolderNumber)
        .call({ from: sender });

      res.json({
        success: true,
        data: {
          name: result.name,
          medicalFolder: result.medicalFolder,
          age: parseInt(result.age),
          gender: result.gender,
          email: result.email,
          phoneNumber: result.phoneNumber,
          medicalDescription: result.medicalDescription,
          temperatures: result.temperatures.map(t => Number(t) / 100),
          timestamps: result.timestamps.map(ts => Number(ts))
        }
      });
    } catch (error) {
      if (error.message.includes("Patient not found")) {
        return res.status(404).json({
          success: false,
          error: "Patient not found"
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Search error:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add this helper function
async function verifyContract() {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = contract.networks[networkId];
  
  console.log("Network ID:", networkId);
  console.log("Deployed network:", deployedNetwork ? "Yes" : "No");
  
  if (deployedNetwork) {
    console.log("Contract address:", deployedNetwork.address);
    const code = await web3.eth.getCode(deployedNetwork.address);
    console.log("Contract code exists:", code.length > 2);
  }
}

// Call it after initialization
initialize().then(() => {
  verifyContract().catch(console.error);
});

// Add this endpoint to get all patients
app.get("/api/patients", async (req, res) => {
  try {
    const accounts = await web3.eth.getAccounts();
    const patients = [];

    for (const account of accounts) {
      try {
        const patient = await medicalRecord.methods.patients(account).call();
        if (patient.exists) {
          patients.push({
            address: account,
            ...patient
          });
        }
      } catch (error) {
        continue;
      }
    }

    res.json({
      success: true,
      data: patients
    });
  } catch (error) {
    console.error("Error getting all patients:", error);
    res.status(500).json({
      success: false,
      error: "Error getting all patients"
    });
  }
});

// Add this endpoint to handle patient updates
app.put("/api/patients/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const {
      name,
      medicalFolder,
      phoneNumber,
      email,
      age,
      gender,
      medicalDescription
    } = req.body;

    // Validate address
    if (!isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address format"
      });
    }

    const result = await medicalRecord.methods
      .updatePatientInfo(
        name,
        medicalFolder,
        phoneNumber,
        email,
        age,
        gender,
        medicalDescription
      )
      .send({ from: address, gas: 3000000 });

    res.json({
      success: true,
      transaction: result.transactionHash,
      patientAddress: address
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Add this endpoint to get a single patient by address
app.get("/api/patients/:address", async (req, res) => {
  try {
    const { address } = req.params;

    // Validate address
    if (!isValidAddress(address)) {
      return res.status(400).json({
        success: false,
        error: "Invalid Ethereum address format"
      });
    }

    try {
      const result = await medicalRecord.methods
        .getPatientData(address)
        .call();

      res.json({
        success: true,
        data: {
          name: result.name,
          medicalFolder: result.medicalFolder,
          phoneNumber: result.phoneNumber,
          email: result.email,
          age: parseInt(result.age),
          gender: result.gender,
          medicalDescription: result.medicalDescription,
          temperatures: result.temperatures.map(t => Number(t) / 100),
          timestamps: result.timestamps.map(ts => Number(ts))
        }
      });
    } catch (error) {
      // Check if it's a "Patient not found" error
      if (error.message.includes("Patient not found")) {
        return res.status(404).json({
          success: false,
          error: "Patient not found"
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error getting patient:", error);
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
