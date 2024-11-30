import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { Patient } from '../models/patient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="patientData">
      <h2>Patient Profile</h2>
      <div class="patient-info">
        <p><strong>Name:</strong> {{patientData.name}}</p>
        <p><strong>Medical Folder:</strong> {{patientData.medicalFolder}}</p>
        <p><strong>Phone:</strong> {{patientData.phoneNumber}}</p>
        <p><strong>Email:</strong> {{patientData.email}}</p>
        <p><strong>Age:</strong> {{patientData.age}}</p>
        <p><strong>gender:</strong> {{patientData.gender}}</p>
        <p><strong>Medical Description:</strong> {{patientData.medicalDescription}}</p>
      </div>

      <div class="temperature-records" *ngIf="patientData.temperatures?.length">
        <h3>Temperature Records</h3>
        <div *ngFor="let temp of patientData.temperatures; let i = index">
          <p>Temperature: {{temp}}°C - Time: {{formatDate(patientData.timestamps![i])}}</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  patientData: Patient | null = null;
  currentAccount: string = '';

  constructor(private blockchainService: BlockchainService) {}

  async ngOnInit() {
    try {
      const accounts = await this.blockchainService.getAccounts();
      this.currentAccount = accounts[0];
      await this.loadPatientData();
    } catch (error) {
      console.error('Error initializing profile:', error);
    }
  }

  async loadPatientData() {
    try {
      this.patientData = await this.blockchainService.getPatientData(this.currentAccount);
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString();
  }
}
