import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private user: any;
  constructor() {}

  setUser(_name: string, _email: string, _password: string, _role: string) {
    this.user = {
      name: _name,
      email: _email,
      //password: _password,
      //role: _role,
    };
    localStorage.setItem('user', JSON.stringify(this.user));
    console.log('user entered: ' + this.user.name);
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user') as string);
    if (this.user) {
      console.log('getuser: ' + this.user.name);
      return this.user;
    }
    return null;
  }
}
