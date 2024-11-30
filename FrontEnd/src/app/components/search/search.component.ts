import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlockchainService } from '../../services/blockchain.service';
import { Patient, PatientRegistration, TemperatureRecord } from '../../models/patient.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Search Section -->
      <div class="search-section">
        <h2>Patient Search</h2>
        <div class="search-form">
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="searchName" 
              name="name" 
              placeholder="Search by name"
            />
            <input 
              type="text" 
              [(ngModel)]="searchFolder" 
              name="folder" 
              placeholder="Medical folder number (optional)"
            />
            <button (click)="searchPatient()">Search</button>
          </div>
        </div>
      </div>

      <!-- Patient List Section -->
      <div class="patient-list" *ngIf="!selectedPatient && !isAddingNew">
        <h2>All Patients</h2>
        <button class="add-button" (click)="startAddNew()">+ Add New Patient</button>
        
        <div class="patient-grid">
          <div class="patient-card" *ngFor="let patient of patients" (click)="selectPatient(patient)">
            <h3>{{ patient.name }}</h3>
            <p><strong>Folder:</strong> {{ patient.medicalFolder }}</p>
            <p><strong>Age:</strong> {{ patient.age }}</p>
            <p><strong>Gender:</strong> {{ patient.gender }}</p>
            <div class="card-actions">
              <button class="edit-btn" (click)="editPatient(patient); $event.stopPropagation()">
                Edit
              </button>
              <button class="view-btn">View Details</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Patient Form -->
      <div class="patient-form-section" *ngIf="isAddingNew || isEditing">
        <h2>{{ isEditing ? 'Edit Patient' : 'Add New Patient' }}</h2>
        <form (ngSubmit)="savePatient()" class="patient-form">
          <div class="form-group" *ngIf="!isEditing">
            <label for="address">Ethereum Address*</label>
            <input
              type="text"
              id="address"
              [(ngModel)]="currentPatient.address"
              name="address"
              required
            />
          </div>

          <div class="form-group">
            <label for="name">Name*</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="currentPatient.name"
              name="name"
              required
            />
          </div>

          <div class="form-group">
            <label for="medicalFolder">Medical Folder</label>
            <input
              type="text"
              id="medicalFolder"
              [(ngModel)]="currentPatient.medicalFolder"
              name="medicalFolder"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <input
                type="number"
                id="age"
                [(ngModel)]="currentPatient.age"
                name="age"
              />
            </div>

            <div class="form-group">
              <label for="gender">Gender</label>
              <select id="gender" [(ngModel)]="currentPatient.gender" name="gender">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="currentPatient.email"
                name="email"
              />
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                [(ngModel)]="currentPatient.phoneNumber"
                name="phoneNumber"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="medicalDescription">Medical Description</label>
            <textarea
              id="medicalDescription"
              [(ngModel)]="currentPatient.medicalDescription"
              name="medicalDescription"
              rows="4"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit">{{ isEditing ? 'Update' : 'Save' }}</button>
            <button type="button" class="secondary" (click)="cancelEdit()">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Patient Details View -->
      <div class="patient-details" *ngIf="selectedPatient && !isEditing">
        <button class="back-button" (click)="clearSelection()">← Back to List</button>
        <h2>Patient Details</h2>
        <div class="details-grid">
          <div class="detail-item">
            <label>Name:</label>
            <span>{{ selectedPatient.name }}</span>
          </div>
          <div class="detail-item">
            <label>Medical Folder:</label>
            <span>{{ selectedPatient.medicalFolder }}</span>
          </div>
          <div class="detail-item">
            <label>Age:</label>
            <span>{{ selectedPatient.age }}</span>
          </div>
          <div class="detail-item">
            <label>Gender:</label>
            <span>{{ selectedPatient.gender }}</span>
          </div>
          <div class="detail-item">
            <label>Email:</label>
            <span>{{ selectedPatient.email }}</span>
          </div>
          <div class="detail-item">
            <label>Phone:</label>
            <span>{{ selectedPatient.phoneNumber }}</span>
          </div>
          <div class="detail-item full-width">
            <label>Medical Description:</label>
            <p>{{ selectedPatient.medicalDescription }}</p>
          </div>
        </div>

        <div class="temperature-history" *ngIf="selectedPatient.temperatures?.length">
          <h3>Temperature History</h3>
          <div class="temperature-list">
            <div class="temperature-item" *ngFor="let temp of selectedPatient.temperatures; let i = index">
              <span>{{ temp }}°C</span>
              <span>{{ selectedPatient.timestamps?.[i] | date:'medium' }}</span>
            </div>
          </div>
        </div>

        <div class="detail-actions">
          <button (click)="editPatient(selectedPatient)">Edit Patient</button>
          <button (click)="recordTemperature()" class="secondary">Record Temperature</button>
        </div>
      </div>

      <!-- Messages -->
      <div class="message-box" *ngIf="message">
        <div [class]="messageSuccess ? 'success' : 'error'">
          {{ message }}
        </div>
      </div>

      <!-- Temperature Recording Modal -->
      <div class="modal-overlay" *ngIf="isRecordingTemperature">
        <div class="modal-content">
          <h3>Record Temperature</h3>
          <p>Recording temperature for: {{ selectedPatient?.name }}</p>
          
          <div class="form-group">
            <label for="temperature">Temperature (°C)</label>
            <input
              type="number"
              id="temperature"
              [(ngModel)]="newTemperature"
              step="0.1"
              min="35"
              max="42"
            />
          </div>

          <div class="message-box" *ngIf="temperatureMessage">
            <div [class]="temperatureSuccess ? 'success' : 'error'">
              {{ temperatureMessage }}
            </div>
          </div>

          <div class="modal-actions">
            <button (click)="saveTemperature()">Save Temperature</button>
            <button class="secondary" (click)="cancelTemperature()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .search-section {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }

    .search-form {
      display: flex;
      gap: 1rem;
    }

    .search-form input {
      flex: 1;
    }

    .patient-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .patient-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .patient-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-item.full-width {
      grid-column: 1 / -1;
    }

    .detail-item label {
      font-weight: 500;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .temperature-list {
      margin-top: 1rem;
    }

    .temperature-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .detail-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button.primary {
      background-color: #3498db;
      color: white;
    }

    button.secondary {
      background-color: #95a5a6;
      color: white;
    }

    button:hover {
      opacity: 0.9;
    }

    .add-button {
      background-color: #2ecc71;
      color: white;
      margin-bottom: 1rem;
    }

    .message-box {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem;
      border-radius: 4px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
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

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      justify-content: flex-end;
    }

    .modal-content input[type="number"] {
      width: 100%;
      padding: 0.5rem;
      font-size: 1.2rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    button.secondary {
      background-color: #6c757d;
    }

    button.secondary:hover {
      background-color: #5a6268;
    }
  `]
})
export class SearchComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  currentPatient: PatientRegistration | Patient = this.getEmptyPatient();
  
  searchName: string = '';
  searchFolder: string = '';
  
  isAddingNew: boolean = false;
  isEditing: boolean = false;
  
  message: string = '';
  messageSuccess: boolean = false;
  messageTimeout: any;
  
  isRecordingTemperature: boolean = false;
  newTemperature: number = 37.0;
  temperatureMessage: string = '';
  temperatureSuccess: boolean = false;

  constructor(private blockchainService: BlockchainService) {}

  async ngOnInit() {
    await this.loadPatients();
  }

  async loadPatients() {
    try {
      this.patients = await this.blockchainService.getAllPatients();
    } catch (error) {
      this.showMessage('Error loading patients', false);
    }
  }

  async searchPatient() {
    if (!this.searchName && !this.searchFolder) {
      this.showMessage('Please enter search criteria', false);
      return;
    }

    try {
      const result = await this.blockchainService.searchPatient(
        this.searchName,
        this.searchFolder
      );
      
      if (result) {
        this.selectPatient(result);
      } else {
        this.showMessage('No patient found', false);
      }
    } catch (error: any) {
      this.showMessage(error.message || 'Error searching for patient', false);
    }
  }

  selectPatient(patient: Patient) {
    this.selectedPatient = patient;
    this.isAddingNew = false;
    this.isEditing = false;
  }

  startAddNew() {
    this.currentPatient = this.getEmptyPatient();
    this.isAddingNew = true;
    this.isEditing = false;
    this.selectedPatient = null;
  }

  editPatient(patient: Patient) {
    this.currentPatient = { ...patient };
    this.isEditing = true;
    this.isAddingNew = false;
  }

  async savePatient() {
    try {
      if (this.isEditing) {
        await this.blockchainService.updatePatient(this.currentPatient as Patient);
        this.showMessage('Patient updated successfully', true);
      } else {
        await this.blockchainService.registerPatient(this.currentPatient as PatientRegistration);
        this.showMessage('Patient registered successfully', true);
      }
      
      await this.loadPatients();
      this.cancelEdit();
    } catch (error: any) {
      this.showMessage(error.message || 'Error saving patient', false);
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.isAddingNew = false;
    this.currentPatient = this.getEmptyPatient();
  }

  clearSelection() {
    this.selectedPatient = null;
    this.isEditing = false;
    this.isAddingNew = false;
  }

  async recordTemperature() {
    this.isRecordingTemperature = true;
  }

  async saveTemperature() {
    if (!this.selectedPatient?.address) {
      this.temperatureMessage = 'No patient selected';
      this.temperatureSuccess = false;
      return;
    }

    try {
      await this.blockchainService.recordTemperature({
        address: this.selectedPatient.address,
        temperature: this.newTemperature
      });

      this.temperatureMessage = 'Temperature recorded successfully';
      this.temperatureSuccess = true;
      
      // Refresh patient data to show new temperature
      const updatedPatient = await this.blockchainService.getPatientData(this.selectedPatient.address);
      this.selectedPatient = {
        ...updatedPatient,
        address: this.selectedPatient.address
      };
      
      this.isRecordingTemperature = false;
      this.newTemperature = 37.0;
    } catch (error: any) {
      this.temperatureMessage = error.message || 'Error recording temperature';
      this.temperatureSuccess = false;
    }
  }

  cancelTemperature() {
    this.isRecordingTemperature = false;
    this.newTemperature = 37.0;
    this.temperatureMessage = '';
  }

  private getEmptyPatient(): PatientRegistration {
    return {
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

  private showMessage(text: string, success: boolean) {
    this.message = text;
    this.messageSuccess = success;
    
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    
    this.messageTimeout = setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
