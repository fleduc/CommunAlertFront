# CommunAlert Frontend

PLEASE NOTE THAT THE PURPOSE OF THIS PROJECT IS TO BE USED FOR JOB INTERVIEWS THIS PROJECT IS NOT COMPLETE, AS IT IS JUST A PROOF OF CONCEPT AND COULD BE MODIFIED AND DEFINITELY IMPROVED IN THE FUTURE

***
### I HAVE STOPPED THE PUBLIC DEVELOPMENT OF THIS APPLICATION. SINCE I WANT TO PUBLISH THIS SYSTEM, THE REST WILL NOW BE DEVELOPED IN A PRIVATE REPO   
***

CommunAlert Frontend is a modern React-based web application that provides a user interface for managing alerts and communications. Built with TypeScript, Vite, and Tailwind CSS.

## Table of Contents

- [Project Overview](#project-overview)
- [Infrastructure](#infrastructure)
- [Plugins and Dependencies](#plugins-and-dependencies)
- [Installation](#installation)
- [Swagger Documentation](#swagger-documentation)

## Project Overview

CommunAlert Frontend is designed to provide an intuitive interface for:
- **User Authentication:** Secure login using JWT-based authentication.
- **Alerts Management:** Viewing alerts, alert details, and sending messages related to alerts.
- **Routing:** Implementing protected routes to ensure that only authenticated users can access specific pages.

## Infrastructure

The project is structured to promote modularity and ease of maintenance:

- **Pages:** Contains main views like `Login`, `AlertsList`, `AlertDetail`, and `Layout`.
- **Components:** Reusable UI components such as `Header` and `Layout`.
- **Context:** Uses `AuthContext` for managing user authentication and global state.
- **Configuration Files:**
    - **pagkcage.json (package.json):** Defines project metadata, scripts, and dependencies.
    - **postcss.config.js:** Configures PostCSS to use Tailwind CSS and Autoprefixer.
    - **vite.config.ts:** Sets up the Vite development server (including proxy configuration) and integrates the React plugin.
    - **tsconfig.json:** Configures TypeScript settings.

## Plugins and Dependencies

### Dependencies

- **react:** ^19.0.0  
  Library for building user interfaces.

- **react-dom:** ^19.0.0  
  DOM-specific methods for React.

- **react-router-dom:** ^7.1.5  
  Routing library for React applications.

- **jwt-decode:** ^4.0.0  
  Library to decode JSON Web Tokens (JWT).

### Dev Dependencies

- **vite:** ^6.1.0  
  Fast development server and build tool.

- **@vitejs/plugin-react:** ^4.3.4  
  Vite plugin to integrate React.

- **typescript:** ~5.7.2  
  Adds static typing to JavaScript.

- **@types/react:** ^19.0.8  
  TypeScript definitions for React.

- **@types/react-dom:** ^19.0.3  
  TypeScript definitions for React DOM.

- **eslint:** ^9.19.0  
  Pluggable JavaScript/TypeScript linter.

- **@eslint/js:** ^9.19.0  
  ESLint configuration for JavaScript.

- **eslint-plugin-react-hooks:** ^5.0.0  
  ESLint rules for React hooks.

- **eslint-plugin-react-refresh:** ^0.4.18  
  ESLint plugin supporting React Fast Refresh.

- **globals:** ^15.14.0  
  Provides global variables for ESLint.

- **postcss:** ^8.5.2  
  Tool for transforming CSS with JavaScript.

- **tailwindcss:** ^3.3.2  
  Utility-first CSS framework.

- **typescript-eslint:** ^8.22.0  
  ESLint plugin for TypeScript support.

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/fleduc/CommunAlertFront.git
   cd communalert-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```
   
3. **Running the Application**

   ```bash
   npm run dev
   ```

4. **Go to the frontend**

   ```bash
   In your browser: http://localhost:5174/
   ```
5. **Test user accounts**

   ```bash
   After starting the backend containger and running the migration, 
   you will find two test accounts in your DB:
   
   a)  username: "john@example.com" password: "password"
   b)  username: "jane@example.com" password: "password"
   ```
###
MAKE SURE TO ALSO INSTALL THE BACKEND BEFORE ACCESSING THIS FRONTEND APPLICATION
Backend repo: https://github.com/fleduc/CommunAlertBack

## Swagger Documentation

The backend API is documented using Swagger. You can access the Swagger UI at:

http://localhost:8000/docs#

This documentation allows you to explore and test the API endpoints available for the application.