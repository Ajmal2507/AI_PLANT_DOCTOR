# Plant Disease Detection System
### Advanced AI-Powered Plant Disease Detection & Advisory Platform

---

## Project Structure

```
Plant_disease/
├── backend/              ← Django REST API
│   ├── core/             ← Project settings, URLs
│   ├── accounts/         ← Register, Login, Profile
│   ├── detection/        ← AI image analysis inference
│   ├── history/          ← View/delete past analyses
│   ├── reports/          ← PDF report generation
│   ├── dashboard/        ← Statistics & chart endpoints
│   ├── media/            ← Uploaded images (auto-created)
│   ├── manage.py
│   ├── requirements.txt
│   └── .env              ← Environment variables
│
└── frontend/             ← React + Vite application
    ├── src/
    │   ├── pages/        ← HomePage, AuthPage, ResultPage, etc.
    │   ├── components/   ← Shared UI components
    │   ├── services/     ← api.js (Axios API client)
    │   ├── context/      ← AuthContext.jsx (Authentication state)
    │   ├── App.jsx       ← Application routing
    │   ├── main.jsx      ← React entry point
    │   └── index.css     ← Global styles and CSS variables
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## Setup Instructions

### Step 1: Database Initialization

Open your MySQL console and execute:
```sql
CREATE DATABASE plant_disease_db;
```

### Step 2: Environment Configuration

Edit `backend/.env` and supply the required configuration values:
```env
SECRET_KEY=your-random-secret-key
DEBUG=True
DB_NAME=plant_disease_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
GROQ_API_KEY=your_groq_api_key_here
```

*Note: You can acquire an API key from the Groq Developer Console.*

### Step 3: Backend Setup (Django)

```bash
# Navigate to the backend directory
cd backend

# Initialize a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Execute database migrations
python manage.py makemigrations
python manage.py migrate

# Create a superuser account (optional)
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver
```

The Django API will be accessible at: `http://localhost:8000`

### Step 4: Frontend Setup (React)

```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

The React application will be accessible at: `http://localhost:5173`

---

## System Architecture & Workflow

```text
1. Image Upload
   → Client uploads a plant image via the React interface.
2. Image Processing
   → Django processes and stores the image in the local media directory.
3. Vision Inference
   → The image is analyzed by the visual inference model to identify the plant species and detect anomalies/diseases.
4. Advisory Generation
   → A secondary language model generates structured advisory data including descriptions, causes, symptoms, natural/chemical remedies, and prevention strategies.
5. Data Persistence
   → The structured results and associated metadata are stored in the MySQL database.
6. Client Presentation
   → The React frontend retrieves the data and presents a structured report to the user.
7. Report Generation
   → Users can export the complete diagnostic report as a PDF via the ReportLab integration.
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Account registration |
| POST | `/api/auth/login/` | Authentication and JWT issuance |
| POST | `/api/auth/logout/` | Terminate session |
| GET/PUT | `/api/auth/profile/` | Retrieve or modify user profile |
| POST | `/api/detection/analyze/` | Submit image for AI analysis |
| GET | `/api/history/` | Retrieve paginated analysis history |
| GET | `/api/history/<id>/` | Retrieve specific analysis details |
| DELETE | `/api/history/<id>/delete/` | Delete an analysis record |
| GET | `/api/reports/<id>/pdf/` | Generate and download PDF report |
| GET | `/api/dashboard/stats/` | Retrieve aggregate statistics |
| GET | `/api/dashboard/charts/` | Retrieve chart data metrics |
| GET | `/api/dashboard/recent/` | Retrieve recent analyses |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite |
| Styling | Bootstrap 5, Custom CSS |
| Visualization | Chart.js, react-chartjs-2 |
| Backend | Django 4.2, Django REST Framework |
| Authentication | JSON Web Tokens (JWT) |
| Database | MySQL |
| Inference Engine | Groq API |
| Document Generation | ReportLab |

---

## Core System Files

| File | Purpose |
|------|---------|
| `backend/detection/groq_client.py` | Core AI integration and prompt execution |
| `backend/core/settings.py` | Application-wide Django configurations |
| `frontend/src/services/api.js` | Axios instance and API call definitions |
| `frontend/src/context/AuthContext.jsx` | React Context for session management |
| `frontend/src/App.jsx` | Application router and layout definition |
