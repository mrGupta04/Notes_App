
# SaaS Notes Application

A multi-tenant note-taking application with subscription-based features built with **React** (frontend) and **Node.js/Express** (backend) using **MongoDB**.

## Live Demo

Experience the application in action:

👉 [https://notes-app-k5cb.vercel.app/](https://notes-app-k5cb.vercel.app/)


---

## Features

- **Multi-tenant Architecture:** Separate workspaces for different organizations.
- **User Authentication:** JWT-based login system.
- **Role-based Access:** Admin and Member roles with different permissions.
- **Subscription Plans:**
  - Free: 3 notes per tenant
  - Pro: Unlimited notes (upgradeable by admin)
- **CRUD Operations:** Create, read, update, and delete notes.
- **Responsive Design:** Modern UI for desktop and mobile.

---

## Tech Stack

**Frontend:**
- React 18
- Context API for state management
- CSS3 with custom properties and modern styling
- Responsive design

**Backend:**
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT authentication
- bcryptjs for password hashing
- CORS and Helmet for security

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation
Clone the repository:

```bash
git clone <your-repo-url>
cd saas-notes-app
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend` directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/saas-notes
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Frontend Setup

```bash
cd frontend
npm install
```

Start the applications:

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

## Test Accounts

**Acme Corporation**
- Admin: admin@acme.test / password
- Member: user@acme.test / password

**Globex Corporation**
- Admin: admin@globex.test / password
- Member: user@globex.test / password

---

## API Endpoints

**Authentication**
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

**Notes**
- `GET /notes` - Get all notes for current tenant
- `GET /notes/:id` - Get specific note
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note

**Tenants**
- `POST /tenants/:slug/upgrade` - Upgrade to Pro plan (admin only)
- `GET /tenants/:slug` - Get tenant info

---

## Project Structure

```
saas-notes-app/
├── backend/
│   ├── config/
│   │   └── initDatabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Note.js
│   │   ├── Tenant.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── tenants.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Header/
│   │   │   ├── Login/
│   │   │   ├── NoteCard/
│   │   │   ├── NoteForm/
│   │   │   ├── NotesList/
│   │   │   └── SubscriptionInfo/
│   │   ├── contexts/
│   │   │   ├── AppContent.js
│   │   │   ├── AuthContext.js
│   │   │   └── NotesContext.js
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

---

## Features Explanation

**Subscription System**
- Free Plan: Limited to 3 notes per tenant
- Pro Plan: Unlimited notes (upgraded by admin users)
- Admin users can upgrade their tenant to Pro plan
- Note limit enforcement on backend and UI warnings on frontend

**Multi-tenancy**
- Each tenant (organization) has isolated data
- Users can only access notes from their own tenant
- Tenant-specific subscription plans

**Security Features**
- JWT authentication with expiration
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Helmet.js security headers

---
---
