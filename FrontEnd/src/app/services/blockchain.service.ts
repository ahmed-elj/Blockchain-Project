import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient, PatientRegistration, TemperatureRecord } from '../models/patient.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private apiUrl = 'http://localhost:4000/api';
  private doctorAddress: string = '';

  constructor(private http: HttpClient) {}

  setDoctorAddress(address: string) {
    this.doctorAddress = address;
  }

  async getAccounts(): Promise<string[]> {
    const response = await firstValueFrom(
      this.http.get<{success: boolean, accounts: string[]}>(
        `${this.apiUrl}/accounts`
      )
    );
    return response.accounts;
  }

  async registerPatient(patientData: PatientRegistration): Promise<any> {
    const response = await firstValueFrom(
      this.http.post(`${this.apiUrl}/patients`, patientData)
    );
    return response;
  }

  async getPatientData(address: string): Promise<Patient> {
    try {
      const response = await firstValueFrom(
        this.http.get<{success: boolean, data: Patient}>(
          `${this.apiUrl}/patients/${address}`
        )
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error('Patient not found');
      }
      throw error;
    }
  }

  async recordTemperature(data: TemperatureRecord): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.post(`${this.apiUrl}/temperature`, data)
      );
      return response;
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error('Patient not found');
      }
      throw error;
    }
  }

  async searchPatient(name: string, folderNumber?: string): Promise<Patient | null> {
    try {
      if (!name) {
        throw new Error('Name is required for search');
      }

      const params: any = { 
        name,
        folderNumber: folderNumber || ''
      };

      const response = await firstValueFrom(
        this.http.get<{success: boolean, data: Patient}>(
          `${this.apiUrl}/search`, 
          { params }
        )
      );
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getAllPatients(): Promise<Patient[]> {
    try {
      // First get all patient addresses
      const accounts = await this.getAccounts();
      const patients: Patient[] = [];
      
      for (const account of accounts) {
        try {
          const response = await firstValueFrom(
            this.http.get<{success: boolean, data: Patient}>(
              `${this.apiUrl}/patients/${account}`
            )
          );
          if (response.success) {
            patients.push({
              ...response.data,
              address: account
            });
          }
        } catch (error) {
          // Skip if not a patient
          continue;
        }
      }
      
      return patients;
    } catch (error) {
      console.error('Error getting all patients:', error);
      return [];
    }
  }

  async updatePatient(patientData: Patient): Promise<any> {
    const response = await firstValueFrom(
      this.http.put(`${this.apiUrl}/patients/${patientData.address}`, patientData)
    );
    return response;
  }
}
