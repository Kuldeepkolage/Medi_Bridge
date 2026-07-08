# 🦷 MediBridge Dental Clinic

A modern full-stack dental clinic management platform built using the MERN stack. MediBridge streamlines patient appointment booking, emergency requests, feedback management, and clinic administration through an intuitive and scalable web application.

---

## 📌 Overview

MediBridge was developed to bridge the gap between patients and dental clinics by providing a centralized platform for appointment scheduling, emergency assistance, patient engagement, and administrative management.

The system offers separate experiences for patients and administrators while maintaining secure authentication and role-based access control.

Website link :
https://medi-bridge-mu.vercel.app/

---

## ✨ Key Features

### 👤 Patient Portal

* Secure User Registration & Login
* JWT Authentication
* Book Dental Appointments
* View Personal Appointment History
* Reschedule Existing Appointments
* Submit Emergency Requests
* Ratings & Feedback System
* Multi-language Support

  * English
  * Hindi
  * Marathi
* Responsive Mobile-Friendly Interface

---

### 🏥 Clinic Administration

* Comprehensive Admin Dashboard
* Appointment Management

  * Approve Appointments
  * Reject Appointments
  * Mark Appointments as Completed
* Patient Records Management
* Review Moderation
* Emergency Request Monitoring
* Real-Time Statistics & Analytics
* Role-Based Access Control

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Authentication

* JSON Web Tokens (JWT)

### Version Control

* Git
* GitHub

---

## 🏗 System Architecture

```text
Frontend (React + Tailwind)
          │
          ▼
Backend API (Node.js + Express)
          │
          ▼
MongoDB Atlas Database
```

---

## 📂 Project Structure

```text
MediBridge
│
├── Frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   └── routes
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/Kuldeepkolage/Medi_Bridge.git

cd Medi_Bridge
```

### 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

Run the backend server:

```bash
npm start
```

---

### 3. Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

---

## 🔐 Environment Variables

Required backend environment variables:

| Variable   | Description                       |
| ---------- | --------------------------------- |
| PORT       | Backend Server Port               |
| MONGO_URI  | MongoDB Atlas Connection String   |
| JWT_SECRET | Secret Key For JWT Authentication |

---

## 🎯 Future Enhancements

* Profile Management System
* Email Notifications
* Appointment Reminder Service
* Doctor Availability Management
* Online Payment Integration
* Medical Report Uploads
* Advanced Analytics Dashboard
* Also implementing Devops in it

---

## 🔒 Security Features

* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Secure API Access
* Environment Variable Protection
* MongoDB Atlas Security

---

## 📈 Project Status

✅ Active Development

Current Focus:

* Profile Management
* Enhanced Admin Dashboard
* Improved User Experience
* Production Deployment Preparation

Website link :
https://medi-bridge-mu.vercel.app/

---

## 👨‍💻 Developer

**Kuldeep Kolage**

Third Year B.E. Information Technology Student

GitHub:
https://github.com/Kuldeepkolage

---

## 📜 License

This project is licensed under the MIT License.

---

### © 2025 MediBridge Dental Clinic

Built with dedication to improve dental healthcare accessibility and clinic management efficiency.
