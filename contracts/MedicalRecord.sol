// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Patient {
        string name;
        string medicalFolder;
        string phoneNumber;
        string email;
        uint256 age;
        string gender;
        string medicalDescription;
        uint256[] temperatures;
        uint256[] timestamps;
        bool exists;
    }
    
    mapping(address => Patient) public patients;
    address[] public patientAddresses;
    
    event TemperatureRecorded(address indexed patientAddress, uint256 temperature, uint256 timestamp);
    event PatientRegistered(
        address indexed patientAddress, 
        string name,
        string medicalFolder,
        string phoneNumber,
        string email,
        uint256 age,
        string gender
    );
    
    function registerPatient(
        string memory _name,
        string memory _medicalFolder,
        string memory _phoneNumber,
        string memory _email,
        uint256 _age,
        string memory _gender,
        string memory _medicalDescription
    ) public {
        require(!patients[msg.sender].exists, "Patient already registered");
        
        patients[msg.sender].name = _name;
        patients[msg.sender].medicalFolder = _medicalFolder;
        patients[msg.sender].phoneNumber = _phoneNumber;
        patients[msg.sender].email = _email;
        patients[msg.sender].age = _age;
        patients[msg.sender].gender = _gender;
        patients[msg.sender].medicalDescription = _medicalDescription;
        patients[msg.sender].exists = true;
        
        patientAddresses.push(msg.sender);
        
        emit PatientRegistered(
            msg.sender, 
            _name,
            _medicalFolder,
            _phoneNumber,
            _email,
            _age,
            _gender
        );
    }
    
    function recordTemperature(uint256 _temperature) public {
        require(patients[msg.sender].exists, "Patient not registered");
        
        patients[msg.sender].temperatures.push(_temperature);
        patients[msg.sender].timestamps.push(block.timestamp);
        
        emit TemperatureRecorded(msg.sender, _temperature, block.timestamp);
    }
    
    function getPatientData(address _patientAddress) public view returns (
        string memory name,
        string memory medicalFolder,
        string memory phoneNumber,
        string memory email,
        uint256 age,
        string memory gender,
        string memory medicalDescription,
        uint256[] memory temperatures,
        uint256[] memory timestamps
    ) {
        require(patients[_patientAddress].exists, "Patient not found");
        
        Patient storage patient = patients[_patientAddress];
        return (
            patient.name,
            patient.medicalFolder,
            patient.phoneNumber,
            patient.email,
            patient.age,
            patient.gender,
            patient.medicalDescription,
            patient.temperatures,
            patient.timestamps
        );
    }

    function updatePatientInfo(
        string memory _name,
        string memory _medicalFolder,
        string memory _phoneNumber,
        string memory _email,
        uint256 _age,
        string memory _gender,
        string memory _medicalDescription
    ) public {
        require(patients[msg.sender].exists, "Patient not registered");
        
        Patient storage patient = patients[msg.sender];
        patient.name = _name;
        patient.medicalFolder = _medicalFolder;
        patient.phoneNumber = _phoneNumber;
        patient.email = _email;
        patient.age = _age;
        patient.gender = _gender;
        patient.medicalDescription = _medicalDescription;
    }

    function searchPatient(string memory _name, string memory _folderNumber) public view returns (
        string memory name,
        string memory medicalFolder,
        uint256 age,
        string memory gender,
        string memory email,
        string memory phoneNumber,
        string memory medicalDescription,
        uint256[] memory temperatures,
        uint256[] memory timestamps
    ) {
        require(bytes(_name).length > 0, "Name is required");
        
        bool found = false;
        address patientAddr;
        
        for (uint i = 0; i < patientAddresses.length; i++) {
            Patient storage patient = patients[patientAddresses[i]];
            
            // Check if name matches
            if (keccak256(bytes(patient.name)) == keccak256(bytes(_name))) {
                // If no folder number specified or folder number matches
                if (bytes(_folderNumber).length == 0 || 
                    keccak256(bytes(patient.medicalFolder)) == keccak256(bytes(_folderNumber))) {
                    patientAddr = patientAddresses[i];
                    found = true;
                    break;
                }
            }
        }
        
        require(found, "Patient not found");
        
        Patient storage patient = patients[patientAddr];
        return (
            patient.name,
            patient.medicalFolder,
            patient.age,
            patient.gender,
            patient.email,
            patient.phoneNumber,
            patient.medicalDescription,
            patient.temperatures,
            patient.timestamps
        );
    }

    function getAllPatientAddresses() public view returns (address[] memory) {
        return patientAddresses;
    }

    function registerPatientByAddress(
        address _patientAddress,
        string memory _name,
        string memory _medicalFolder,
        string memory _phoneNumber,
        string memory _email,
        uint256 _age,
        string memory _gender,
        string memory _medicalDescription
    ) public {
        require(!patients[_patientAddress].exists, "Patient already registered");
        
        patients[_patientAddress].name = _name;
        patients[_patientAddress].medicalFolder = _medicalFolder;
        patients[_patientAddress].phoneNumber = _phoneNumber;
        patients[_patientAddress].email = _email;
        patients[_patientAddress].age = _age;
        patients[_patientAddress].gender = _gender;
        patients[_patientAddress].medicalDescription = _medicalDescription;
        patients[_patientAddress].exists = true;
        
        patientAddresses.push(_patientAddress);
        
        emit PatientRegistered(
            _patientAddress, 
            _name,
            _medicalFolder,
            _phoneNumber,
            _email,
            _age,
            _gender
        );
    }
} 