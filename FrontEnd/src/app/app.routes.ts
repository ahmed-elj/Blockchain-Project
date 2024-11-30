import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { DoctorComponent } from './doctor/doctor.component';
import { SearchComponent } from './components/search/search.component';
import { PatientManagementComponent } from './components/patient-management/patient-management.component';

export const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'patients', component: PatientManagementComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' }
];
