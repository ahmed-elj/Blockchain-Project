export interface Patient {
  name: string;
  medicalFolder: string;
  phoneNumber: string;
  email: string;
  age: number;
  gender: string;
  medicalDescription: string;
  temperatures?: number[];
  timestamps?: number[];
  address?: string;
}

export interface PatientRegistration {
  name: string;
  address: string;
  medicalFolder?: string;
  phoneNumber?: string;
  email?: string;
  age?: number;
  gender?: string;
  medicalDescription?: string;
}

export interface TemperatureRecord {
  temperature: number;
  address: string;
} 