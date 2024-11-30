const MedicalRecord = artifacts.require("MedicalRecord");

module.exports = function(deployer) {
  deployer.deploy(MedicalRecord)
    .then(() => {
      console.log("MedicalRecord deployed to:", MedicalRecord.address);
    });
}; 