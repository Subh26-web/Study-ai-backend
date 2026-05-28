# 🎓 StudyGenius — AI-Powered Smart Study Generator

StudyGenius is a full-stack web application designed to optimize revision productivity. Built using Node.js, Express, and MongoDB, the platform leverages advanced Natural Language Processing via the Google Gemini API to parse uploaded PDF lecture notes and instantly synthesize summaries, active-recall flashcards, and interactive practice quizzes.

---

## 🚀 Core Architectural Features

* **AI Generation Pipeline:** Upload a physical text dataset or PDF (`multipart/form-data`) to extract core text layers and automatically transform them into structural study resources via Gemini.
* **Interactive Multiple-Choice Quizzes:** Features custom data-parsing fallback systems to automatically normalize raw option outputs (`A)`, `B)`, `C)`, `D)`) into functional choice arrays.
* **Dynamic Analytics Dashboard:** Tracks user history logs directly from MongoDB to render structural counters (`notes uploaded`, `quizzes generated`) and dynamically reads accuracy performance badges via secure browser state caches.
* **Industrial Authentication System:** Restricts access to student portal workspaces using cryptographic JSON Web Tokens (JWT) stored safely inside client `localStorage`.
* **Integrated Q&A Tool Matrix:** Challenge your current study session by running natural language vector evaluation queries directly against your notes' specific backend indexes.

---

## 🛠️ Technology Stack Matrix

* **Frontend:** Vanilla HTML5, CSS3 (Custom Variables, CSS Grids), JavaScript (ES6+ Asynchronous DOM Engine)
* **Backend Runtime:** Node.js, Express.js
* **Database Management:** MongoDB (via Mongoose Object Data Modeling)
* **AI Orchestration:** Google Gemini Pro API (`@google/generative-ai`)
* **Binary Processing:** Multer Middleware (Memory Storage Buffering Engine)
* **Security & Tokens:** JSON Web Tokens (`jsonwebtoken`), BcryptJS password hashing

---

## 📂 Project Directory Structure

```text
StudyGenius/
├── config/
│   └── gemini.js            # Gemini API instantiation wrapper
├── controllers/
│   └── studyController.js   # Unified AI extraction & history route managers
├── models/
│   ├── StudySession.js      # Schema for generated quizzes, flashcards & summaries
│   └── User.js              # Schema for hashed credentials & user profiles
├── routes/
│   └── studyRoutes.js       # Secure router mapping matching auth middlewares
├── services/
│   └── api.js               # Industrial Axios handler (Production configuration)
├── .env                     # Local environmental variables configuration (Ignored)
├── .gitignore               # Excludes dependencies, logs, and sensitive key tokens
├── package.json             # Root dependency map configurations
├── server.js                # Core entry point starting Express server & database
└── test-gemini.js           # Isolated diagnostic prompt evaluation scripts
⚙️ Local Configuration & Installation
1. Clone the Workspace Repository
Bash
git clone [https://github.com/your-username/StudyGenius.git](https://github.com/your-username/StudyGenius.git)
cd StudyGenius
2. Install Server Dependencies
Bash
npm install
3. Establish Local Environment Secrets
Create a .env file in the root directory and populate it with your specific credential variables:

Code snippet
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/studygenius
JWT_SECRET=your_super_secure_jwt_cryptographic_key
GEMINI_API_KEY=your_actual_google_gemini_api_credential_token
4. Boot Up the Application Backend Server
Bash
# Start backend server instance locally
npm start

# For developers using automatic hot-reloads
npm run dev
5. Launch the Frontend Ecosystem
Open your target browser and serve your client assets locally using a Live Server environment pointing to your frontend files (auth.html, dashboard.html).

Plaintext
[http://127.0.0.1:5500/auth.html](http://127.0.0.1:5500/auth.html)
📡 Core API Endpoint Contracts
🔒 Security Subsystem
POST /api/study/auth/signup - Registers a new user profile. Returns JWT token and profile object.

POST /api/study/auth/login - Validates credentials. Returns secure authorization token signature.

🧠 AI Core Processing
POST /api/study/generate - Form-Data endpoint accepts a single binary pdf field. Parses and commits a session object into the DB. Requires Bearer <token> header.

POST /api/study/ask-question - Accepts { docId, question } to fire contextually mapped queries against active documents.

GET /api/study/history - Pulls past generation history logs belonging to the authenticated token.

📜 Repository Licensing
This project is deployed under the MIT License. Feel free to branch out or scale it to suit your workflow parameters.