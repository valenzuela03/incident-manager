# School Incident Manager

Basic system for recording and tracking incidents in a school environment. Allows students and staff to report issues, and administrative staff to manage them efficiently.

---

## Technologies

**Backend**

* Node.js
* Express
* MongoDB + Mongoose
* JWT

**Frontend**

* React 18
* Next.js
* Tailwind CSS
* React Loading

---

## Installation

### Backend

```bash
git clone <REPO_URL>
cd backend
npm install
```

Create a `.env` file with your environment variables:

```
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
```

Start the server:

```bash
npm run server
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
backend/
├── server.js
├── routes/
├── controllers/
├── models/
├── middleware/
└── .env

frontend/
├── pages/
├── components/
├── styles/
├── public/
└── tsconfig.json
```