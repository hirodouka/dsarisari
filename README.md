# Sari-Sari Store Ledger Application

A lightweight and efficient Ledger application designed for local Sari-Sari stores. It allows store owners (Admins) to track customer lists, record credit purchases (debts), and mark them as paid, while allowing customers to view their outstanding ledger.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19) + Vite, React Router DOM, Vanilla CSS, Lucide React Icons
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL) with Row-Level Security (RLS) policies

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   ```
4. Run the backend service:
   ```bash
   node server.js
   ```
   The backend will start listening on `http://localhost:3000`.

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run locally on `http://localhost:5173/`.

---

## 🗄️ Database Schema

The system uses three tables inside Supabase:
- **`admins`**: Stores admin credentials for login (`username`, `password`).
- **`customers`**: Stores customer details (`first_name`, `role`).
- **`debts`**: Tracks items, amounts, dates, and payment status (`customer_id`, `item_name`, `amount`, `date`, `status`).

Default admin account seeded:
- **Username**: `Diana`
- **Password**: `password123`

The schema definition can be viewed at [supabase_schema.sql](file:///c:/Users/Bopbopgurl/Downloads/sari-sari-ledger-app-main/sari-sari-ledger-app-main/backend/supabase_schema.sql).
