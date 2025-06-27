# leasify
A full-stack property management application built with the MERN stack (React, Node.js, Express). Features role-based dashboards for landlords &amp; tenants, lease management, and Stripe payment integration.

# Leasify - Property Management Simplified

A full-stack property management application designed to streamline the rental lifecycle for both landlords and tenants.

---

**Live Demo**: ## About The Project

Leasify is a comprehensive platform built to modernize and simplify property management. It provides a dedicated portal for landlords to manage their properties, leases, and finances, while offering tenants a convenient way to handle payments, submit maintenance requests, and view their lease details.

The goal is to reduce administrative friction and improve communication, creating a more harmonious rental ecosystem. This application is built from the ground up using a modern MERN-like stack.

## Core Features

### 👤 Landlord Features
* **Dashboard**: An at-a-glance overview of key metrics like occupancy, rent collection, and open maintenance requests.
* **Property Management**: Full CRUD (Create, Read, Update, Delete) functionality for properties.
* **Lease & Application Management**: Assign leases to tenants, review applications, and manage the tenant lifecycle.
* **Maintenance Queue**: View and update the status of all maintenance requests submitted by tenants.
* **Financials**: Log offline payments (cash, check) and view payment histories for each lease.
* **Task & Communication Logging**: A personal task list and an activity feed to log all interactions and system events.

### 👤 Tenant Features
* **Personal Dashboard**: A simple dashboard to view active lease details and payment history.
* **Online Payments**: Securely pay rent online using Stripe integration.
* **Maintenance Center**: Submit new maintenance requests and view the history and status of past requests.

### 🌐 Public Features
* **Property Listings**: View publicly listed, vacant properties with details.
* **Application Submission**: Prospective tenants can apply for a property directly from the listing page.

## Tech Stack

This project is built with the following technologies:

| Category      | Technology                                                                                                    |
| :------------ | :------------------------------------------------------------------------------------------------------------ |
| **Frontend** | React, Vite, Redux Toolkit, React Router, Axios, Tailwind CSS, shadcn/ui                                      |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcryptjs, Stripe API                            |
| **DevOps** | Deployed via **Netlify** (Frontend) and **Render** (Backend)                                                  |

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18.x or later)
* npm
* MongoDB (You can use a local instance or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/leasify.git](https://github.com/your-username/leasify.git)
    cd leasify
    ```

2.  **Setup the Backend:**
    ```sh
    # Navigate to the backend directory
    cd backend

    # Install NPM packages
    npm install

    # Create a .env file from the example
    cp .env.example .env
    ```
    Now, open `backend/.env` and add your configuration values (MongoDB URI, JWT Secret, Stripe Keys).

3.  **Setup the Frontend:**
    ```sh
    # Navigate to the frontend directory from the root
    cd frontend

    # Install NPM packages
    npm install

    # Create a development environment file
    # (You can just create a file named .env.development)
    ```
    In `frontend/.env.development`, add the following line:
    `VITE_API_URL=http://localhost:5001/api`

### Running the Application

1.  **Run the Backend Server:**
    *From the `backend` directory:*
    ```sh
    npm start
    ```
    Your backend API will be running at `http://localhost:5001`.

2.  **Run the Frontend Development Server:**
    *From the `frontend` directory (in a new terminal):*
    ```sh
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) to view the app in your browser.

## Project Status
This project is currently in **Version 1.0**. Future improvements planned for V2 include:
-   API-level pagination for all data tables.
-   A comprehensive automated testing suite (Jest, Supertest, React Testing Library).
-   Real-time notifications for maintenance and application status updates.
-   Refactoring backend queries to use MongoDB's aggregation pipeline for better performance.

## License
Distributed under the MIT License. See `LICENSE` for more information.

---
