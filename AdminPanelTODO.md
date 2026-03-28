# Admin Panel Implementation Plan

## Task

Build a complete Admin Panel for the Dentist to manage the clinic

---

## Phase 1: Backend - MongoDB Schema Updates

### 1.1 Update Appointment Model

- Add status field: "pending" | "approved" | "rejected" | "completed"
- Add time field
- Add doctor field
- Set default status to "pending"

---

## Phase 2: Backend - Admin APIs

### 2.1 Create Admin Routes

- `GET /api/admin/appointments` - Get all appointments
- `PUT /api/admin/appointments/:id/approve` - Approve appointment
- `PUT /api/admin/appointments/:id/reject` - Reject appointment
- `PUT /api/admin/appointments/:id/complete` - Complete appointment
- `GET /api/admin/dashboard` - Get analytics data
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/reviews` - Get all reviews
- `DELETE /api/admin/reviews/:id` - Delete review
- `GET /api/admin/emergencies` - Get emergency requests

### 2.2 Create Admin Controller

- Implement all admin functions

---

## Phase 3: Frontend - Admin Dashboard

### 3.1 Create Admin Pages

- `/admin/dashboard` - Overview with statistics
- `/admin/appointments` - Appointment management table
- `/admin/patients` - Patient management
- `/admin/reviews` - Reviews management
- `/admin/emergencies` - Emergency requests

### 3.2 Admin Layout

- Left sidebar navigation
- Main content area
- Professional SaaS-style UI

### 3.3 Install Dependencies

- axios for API calls
- react-big-calendar (optional calendar)

---

## Phase 4: Integration

### 4.1 Update Patient View

- Show appointment status on patient dashboard

### 4.2 Update Routing

- Add admin routes
- Protect admin routes

---

## Files to Create/Modify

### Backend

1. `backend/models/Appointment.model.js` - Add status field
2. `backend/routes/admin.routes.js` - New admin routes
3. `backend/controllers/admin.controller.js` - New admin controller

### Frontend

4. `Frontend/src/pages/admin/Dashboard.jsx` - Admin dashboard
5. `Frontend/src/pages/admin/Appointments.jsx` - Appointment management
6. `Frontend/src/pages/admin/Patients.jsx` - Patient management
7. `Frontend/src/pages/admin/Reviews.jsx` - Reviews management
8. `Frontend/src/pages/admin/Emergencies.jsx` - Emergency requests
9. `Frontend/src/pages/admin/AdminLayout.jsx` - Admin layout component
10. `Frontend/src/App.jsx` - Add admin routes

---

## Status: Pending User Approval
