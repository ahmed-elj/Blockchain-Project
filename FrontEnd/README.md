# Angular Authentication Frontend

## Description
A modern authentication system built with Angular 17.3.4, featuring user registration and login functionality. This frontend application communicates with a Node.js/Express backend running on localhost:3000.

## Features
- User Registration (Signup)
- User Authentication (Login)
- Responsive Design
- Form Validation
- Error Handling
- JWT Token-based Authentication
- RESTful API Integration

## Tech Stack
- Angular 17.3.4
- TypeScript
- RxJS
- Angular Forms
- Angular Router
- Angular HTTP Client

## Prerequisites
- Node.js (Latest LTS version)
- npm (Node Package Manager)
- Angular CLI 17.3.4
- Backend server running on localhost:3000

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Project Structure
- `/src/app/login` - Login component and related files
- `/src/app/signup` - Signup component and related files
- `/src/app/services` - API service for backend communication

## API Integration
The frontend communicates with a backend server running on `http://localhost:3000` with the following endpoints:
- POST `/api/signup` - User registration
- POST `/api/login` - User authentication

## Development
To create new components:
```bash
npm run new-comp component-name
```

## Available Scripts
- `npm start` - Starts development server
- `npm run build` - Builds the application
- `npm test` - Runs unit tests
- `npm run watch` - Builds in watch mode

## Backend Connection
This frontend application requires the backend server to be running. The backend provides:
- User authentication
- Password encryption
- JWT token generation
- MongoDB database integration

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the ISC License.
