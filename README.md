# AI Plant Doctor 🌿
### AI-Powered Plant Disease Detection & Advisory System

---

## 📁 Project Structure

```
Plant_disease/
├── backend/              ← Django REST API
│   ├── core/             ← Project settings, URLs
│   ├── accounts/         ← Register, Login, Profile
│   ├── detection/        ← AI image analysis (Groq)
│   ├── history/          ← View/delete past analyses
│   ├── reports/          ← PDF generation
│   ├── dashboard/        ← Stats & chart data
│   ├── media/            ← Uploaded images (auto-created)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env              ← Your secret keys (fill this in!)
│
└── frontend/             ← React + Vite app
    ├── src/
    │   ├── pages/        ← HomePage, AuthPage, DashboardPage, etc.
    │   ├── components/   ← Navbar, ProtectedRoute
    │   ├── services/     ← api.js (all API calls)
    │   ├── context/      ← AuthContext.jsx (login state)
    │   ├── App.jsx       ← Routes
    │   ├── main.jsx      ← React entry point
    │   └── index.css     ← Global styles
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Setup Instructions

### Step 1: Set Up MySQL Database

Open MySQL and run:
```sql
CREATE DATABASE plant_disease_db;
```

### Step 2: Configure `.env` file

Edit `backend/.env` and fill in your values:
```
SECRET_KEY=your-random-secret-key
DEBUG=True
DB_NAME=plant_disease_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
GROQ_API_KEY=your_groq_api_key_here
```

Get your free Groq API key at: https://console.groq.com

### Step 3: Set Up Python Backend

```bash
# Go to the backend folder
cd backend

# Create a virtual environment (keeps packages isolated)
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install all packages
pip install -r requirements.txt

# Create database tables from our models
python manage.py makemigrations
python manage.py migrate

# Create an admin user (optional)
python manage.py createsuperuser

# Start the Django server
python manage.py runserver
```

Django will run at: http://localhost:8000

### Step 4: Set Up React Frontend

```bash
# Go to the frontend folder (new terminal window)
cd frontend

# Install Node.js packages
npm install

# Start the React development server
npm run dev
```

React will run at: http://localhost:5173

### Step 5: Open the App

Go to **http://localhost:5173** in your browser.

---

## 🧠 How the AI Works

```
1. User uploads leaf image
         ↓
2. Django saves image to disk
         ↓
3. Groq Vision AI (Llama Vision)
   → Identifies plant + disease + confidence
         ↓
4. Groq Chat AI (Llama 4)
   → Generates: description, causes, symptoms,
                natural remedies, chemical remedies, prevention
         ↓
5. Results saved to MySQL
         ↓
6. Frontend displays full report
         ↓
7. User can download PDF report
```

---

## 📡 API Endpoints

| Method | URL | What it does |
|--------|-----|-------------|
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Login, get JWT tokens |
| POST | `/api/auth/logout/` | Logout |
| GET/PUT | `/api/auth/profile/` | View/update profile |
| POST | `/api/detection/analyze/` | Upload image + get AI result |
| GET | `/api/history/` | List all past analyses |
| GET | `/api/history/<id>/` | Single analysis details |
| DELETE | `/api/history/<id>/delete/` | Delete an analysis |
| GET | `/api/reports/<id>/pdf/` | Download PDF report |
| GET | `/api/dashboard/stats/` | Dashboard statistics |
| GET | `/api/dashboard/charts/` | Chart data |
| GET | `/api/dashboard/recent/` | Last 5 analyses |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Bootstrap 5 + Vanilla CSS |
| Charts | Chart.js + react-chartjs-2 |
| Backend | Django 4.2 + Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | MySQL |
| AI Vision | Groq API (Llama Vision) |
| AI Advisory | Groq API (Llama 4) |
| PDF | ReportLab |

---

## 🔑 Key Files to Understand

| File | Purpose |
|------|---------|
| `backend/detection/groq_client.py` | All AI logic — image analysis + advisory |
| `backend/core/settings.py` | Django configuration |
| `frontend/src/services/api.js` | All frontend API calls |
| `frontend/src/context/AuthContext.jsx` | Login state management |
| `frontend/src/App.jsx` | Page routing |
