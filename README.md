# SkillSwap 🔄

SkillSwap is a MERN (MongoDB, Express, React, Node.js) web app that lets users exchange skills by connecting, chatting, and collaborating.

---

## Features

- User registration and login with JWT authentication  
- User profiles showing skills and interests  
- Skill-based user filtering  
- Real-time chat functionality  
- Exchange request management  
- Profile editing and skill updates  
- File upload support (certificates, images)  

---

## Tech Stack

- Frontend: React, Axios, React Router, CSS  
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Multer  

---

## Folder Structure

SkillSwap/
├── client/ # React frontend
├── server/ # Node/Express backend
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── .env # environment variables (DO NOT push)
└── README.md


---

## Getting Started

1. Clone repo:
git clone https://github.com/Sibiya07/SkillSwap.git
cd SkillSwap

2.Create .env in server/ folder with:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

3.Install dependencies:
cd server
npm install
cd ../client
npm install

4.Run the app:
cd ../server
npm start

Open new terminal:

cd client
npm start

Backend runs at http://localhost:5000
Frontend runs at http://localhost:3000

Author
Sibiya Jasmine — MERN Developer
GitHub: https://github.com/Sibiya07

Happy Skill Swapping! 🚀
