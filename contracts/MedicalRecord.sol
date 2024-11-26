// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecord {
    struct Patient {
        string name;
        uint256[] temperatures;
        uint256[] timestamps;
        bool exists;
    }
    
    mapping(address => Patient) public patients;
    
    event TemperatureRecorded(address indexed patientAddress, uint256 temperature, uint256 timestamp);
    event PatientRegistered(address indexed patientAddress, string name);
    
    function registerPatient(string memory _name) public {
        require(!patients[msg.sender].exists, "Patient already registered");
        
        patients[msg.sender].name = _name;
        patients[msg.sender].exists = true;
        
        emit PatientRegistered(msg.sender, _name);
    }
    
    function recordTemperature(uint256 _temperature) public {
        require(patients[msg.sender].exists, "Patient not registered");
        
        patients[msg.sender].temperatures.push(_temperature);
        patients[msg.sender].timestamps.push(block.timestamp);
        
        emit TemperatureRecorded(msg.sender, _temperature, block.timestamp);
    }
    
    function getPatientData(address _patientAddress) public view returns (
        string memory name,
        uint256[] memory temperatures,
        uint256[] memory timestamps
    ) {
        require(patients[_patientAddress].exists, "Patient not found");
        
        return (
            patients[_patientAddress].name,
            patients[_patientAddress].temperatures,
            patients[_patientAddress].timestamps
        );
    }
} 