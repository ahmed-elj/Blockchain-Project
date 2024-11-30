import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockchainService } from '../../services/blockchain.service';
import { Patient, PatientRegistration } from '../../models/patient.model';

@Component({
  selector: 'app-patient-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="management-container">
      <div class="section">
        <h2>Add New Patient</h2>
        <form (ngSubmit)="registerPatient()" class="patient-form">
          <div class="form-group">
            <label for="address">Ethereum Address*</label>
            <input
              type="text"
              id="address"
              [(ngModel)]="newPatient.address"
              name="address"
              required
            />
          </div>

          <div class="form-group">
            <label for="name">Name*</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="newPatient.name"
              name="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="medicalFolder">Medical Folder</label>
            <input
              type="text"
              id="medicalFolder"
              [(ngModel)]="newPatient.medicalFolder"
              name="medicalFolder"
            />
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              [(ngModel)]="newPatient.phoneNumber"
              name="phoneNumber"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="newPatient.email"
              name="email"
            />
          </div>

          <div class="form-group">
            <label for="age">Age</label>
            <input
              type="number"
              id="age"
              [(ngModel)]="newPatient.age"
              name="age"
            />
          </div>

          <div class="form-group">
            <label for="gender">Gender</label>
            <select id="gender" [(ngModel)]="newPatient.gender" name="gender">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="medicalDescription">Medical Description</label>
            <textarea
              id="medicalDescription"
              [(ngModel)]="newPatient.medicalDescription"
              name="medicalDescription"
              rows="4"
            ></textarea>
          </div>

          <button type="submit" [disabled]="!newPatient.address || !newPatient.name">
            Register Patient
          </button>
        </form>

        <div class="message-box" *ngIf="registrationMessage">
          <div [class]="registrationSuccess ? 'success' : 'error'">
            {{ registrationMessage }}
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Modify Patient</h2>
        <div class="search-box">
          <input
            type="text"
            [(ngModel)]="searchAddress"
            placeholder="Enter patient's Ethereum address"
          />
          <button (click)="searchPatient()">Search</button>
        </div>

        <form *ngIf="selectedPatient" (ngSubmit)="updatePatient()" class="patient-form">
          <div class="form-group">
            <label for="mod-name">Name*</label>
            <input
              type="text"
              id="mod-name"
              [(ngModel)]="selectedPatient.name"
              name="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="mod-medicalFolder">Medical Folder</label>
            <input
              type="text"
              id="mod-medicalFolder"
              [(ngModel)]="selectedPatient.medicalFolder"
              name="medicalFolder"
            />
          </div>

          <div class="form-group">
            <label for="mod-phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="mod-phoneNumber"
              [(ngModel)]="selectedPatient.phoneNumber"
              name="phoneNumber"
            />
          </div>

          <div class="form-group">
            <label for="mod-email">Email</label>
            <input
              type="email"
              id="mod-email"
              [(ngModel)]="selectedPatient.email"
              name="email"
            />
          </div>

          <div class="form-group">
            <label for="mod-age">Age</label>
            <input
              type="number"
              id="mod-age"
              [(ngModel)]="selectedPatient.age"
              name="age"
            />
          </div>

          <div class="form-group">
            <label for="mod-gender">Gender</label>
            <select id="mod-gender" [(ngModel)]="selectedPatient.gender" name="gender">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="mod-medicalDescription">Medical Description</label>
            <textarea
              id="mod-medicalDescription"
              [(ngModel)]="selectedPatient.medicalDescription"
              name="medicalDescription"
              rows="4"
            ></textarea>
          </div>

          <button type="submit">Update Patient</button>
        </form>

        <div class="message-box" *ngIf="updateMessage">
          <div [class]="updateSuccess ? 'success' : 'error'">
            {{ updateMessage }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .management-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 2rem;
    }

    .section {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 1.5rem;
    }

    .patient-form {
      display: grid;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: 500;
      color: #34495e;
    }

    input, select, textarea {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      resize: vertical;
    }

    button {
      padding: 0.75rem 1.5rem;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button:hover {
      background-color: #2980b9;
    }

    button:disabled {
      background-color: #bdc3c7;
      cursor: not-allowed;
    }

    .search-box {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-box input {
      flex: 1;
    }

    .message-box {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 4px;
    }

    .success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class PatientManagementComponent implements OnInit {
  newPatient: PatientRegistration = {
    address: '',
    name: '',
    medicalFolder: '',
    phoneNumber: '',
    email: '',
    age: 0,
    gender: '',
    medicalDescription: ''
  };

  selectedPatient: Patient | null = null;
  searchAddress: string = '';
  
  registrationMessage: string = '';
  registrationSuccess: boolean = false;
  updateMessage: string = '';
  updateSuccess: boolean = false;

  constructor(private blockchainService: BlockchainService) {}

  ngOnInit() {}

  async registerPatient() {
    if (!this.newPatient.address || !this.newPatient.name) {
      this.registrationMessage = 'Address and name are required';
      this.registrationSuccess = false;
      return;
    }

    try {
      await this.blockchainService.registerPatient(this.newPatient);
      this.registrationMessage = 'Patient registered successfully';
      this.registrationSuccess = true;
      this.resetForm();
    } catch (error: any) {
      this.registrationMessage = error.message || 'Error registering patient';
      this.registrationSuccess = false;
    }
  }

  async searchPatient() {
    if (!this.searchAddress) {
      this.updateMessage = 'Please enter a patient address';
      this.updateSuccess = false;
      return;
    }

    try {
      const patient = await this.blockchainService.getPatientData(this.searchAddress);
      this.selectedPatient = {
        ...patient,
        address: this.searchAddress
      };
      this.updateMessage = '';
    } catch (error: any) {
      this.updateMessage = error.message || 'Error finding patient';
      this.updateSuccess = false;
      this.selectedPatient = null;
    }
  }

  async updatePatient() {
    if (!this.selectedPatient) return;

    try {
      await this.blockchainService.updatePatient(this.selectedPatient);
      this.updateMessage = 'Patient updated successfully';
      this.updateSuccess = true;
    } catch (error: any) {
      this.updateMessage = error.message || 'Error updating patient';
      this.updateSuccess = false;
    }
  }

  private resetForm() {
    this.newPatient = {
      address: '',
      name: '',
      medicalFolder: '',
      phoneNumber: '',
      email: '',
      age: 0,
      gender: '',
      medicalDescription: ''
    };
  }
} 