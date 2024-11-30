import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { Patient, PatientRegistration } from '../models/patient.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="doctor-container">
      <h2>Doctor Dashboard</h2>
      
      <div class="register-patient">
        <h3>Register New Patient</h3>
        <form (ngSubmit)="registerPatient()">
          <input [(ngModel)]="newPatient.address" name="address" placeholder="Patient Address" required>
          <input [(ngModel)]="newPatient.name" name="name" placeholder="Name" required>
          <input [(ngModel)]="newPatient.medicalFolder" name="medicalFolder" placeholder="Medical Folder">
          <input [(ngModel)]="newPatient.phoneNumber" name="phoneNumber" placeholder="Phone Number">
          <input [(ngModel)]="newPatient.email" name="email" placeholder="Email">
          <input [(ngModel)]="newPatient.age" name="age" type="number" placeholder="Age">
          <input [(ngModel)]="newPatient.gender" name="gender" placeholder="Gender">
          <textarea [(ngModel)]="newPatient.medicalDescription" name="medicalDescription" 
            placeholder="Medical Description"></textarea>
          <button type="submit">Register Patient</button>
        </form>
        
        <div *ngIf="registrationError" class="error-message">
          {{ registrationError }}
        </div>
        <div *ngIf="registrationSuccess" class="success-message">
          Patient registered successfully!
        </div>
      </div>

      <div class="record-temperature" *ngIf="selectedPatient">
        <h3>Record Temperature for {{selectedPatient.name}}</h3>
        <input [(ngModel)]="newTemperature" type="number" step="0.1" placeholder="Temperature">
        <button (click)="recordTemperature()">Record Temperature</button>
        
        <div *ngIf="temperatureError" class="error-message">
          {{ temperatureError }}
        </div>
        <div *ngIf="temperatureSuccess" class="success-message">
          Temperature recorded successfully!
        </div>
      </div>

      <div class="patient-details" *ngIf="selectedPatient">
        <h3>Patient Details</h3>
        <div class="details-grid">
          <p><strong>Name:</strong> {{selectedPatient.name}}</p>
          <p><strong>Medical Folder:</strong> {{selectedPatient.medicalFolder}}</p>
          <p><strong>Phone:</strong> {{selectedPatient.phoneNumber}}</p>
          <p><strong>Email:</strong> {{selectedPatient.email}}</p>
          <p><strong>Age:</strong> {{selectedPatient.age}}</p>
          <p><strong>Gender:</strong> {{selectedPatient.gender}}</p>
          <p><strong>Medical Description:</strong> {{selectedPatient.medicalDescription}}</p>
        </div>
        
        <div class="temperature-history" *ngIf="selectedPatient.temperatures?.length">
          <h4>Temperature History</h4>
          <div class="temperature-list">
            <div *ngFor="let temp of selectedPatient.temperatures; let i = index" class="temperature-item">
              <span>{{temp}}°C</span>
              <span>{{selectedPatient.timestamps![i] | date:'medium'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  selectedPatient: Patient | null = null;
  newTemperature: number = 37.0;
  registrationError: string = '';
  registrationSuccess: boolean = false;
  temperatureError: string = '';
  temperatureSuccess: boolean = false;
  
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

  constructor(private blockchainService: BlockchainService) {}

  async ngOnInit() {
    const accounts = await this.blockchainService.getAccounts();
    this.blockchainService.setDoctorAddress(accounts[0]);
  }

  async registerPatient() {
    this.registrationError = '';
    this.registrationSuccess = false;

    if (!this.newPatient.address || !this.newPatient.name) {
      this.registrationError = 'Address and name are required';
      return;
    }

    try {
      await this.blockchainService.registerPatient(this.newPatient);
      this.registrationSuccess = true;
      this.resetForm();
    } catch (error: any) {
      this.registrationError = error.message || 'Error registering patient';
      console.error('Error registering patient:', error);
    }
  }

  async recordTemperature() {
    this.temperatureError = '';
    this.temperatureSuccess = false;

    if (!this.selectedPatient?.address) {
      this.temperatureError = 'No patient selected';
      return;
    }

    try {
      await this.blockchainService.recordTemperature({
        address: this.selectedPatient.address,
        temperature: this.newTemperature
      });
      this.temperatureSuccess = true;
      await this.refreshPatientData();
    } catch (error: any) {
      this.temperatureError = error.message || 'Error recording temperature';
      console.error('Error recording temperature:', error);
    }
  }

  private async refreshPatientData() {
    if (this.selectedPatient?.address) {
      this.selectedPatient = await this.blockchainService.getPatientData(
        this.selectedPatient.address
      );
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