# WhatsApp Web Clone (MERN Stack)

A WhatsApp Web-like interface built with **MongoDB**, **Express**, **React**, and **Node.js**.  
This project includes **message synchronization from JSON payloads** and **real-time chat functionality**.

---

## 🚀 Features

- WhatsApp-like UI with responsive design
- Message history from JSON payloads
- Conversation grouping
- Message status tracking (sent/delivered/read)
- Demo message sending functionality

---

## 📦 Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local installation or Atlas URI)
- [Git](https://git-scm.com/)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/hereTariq/whatsapp-web-clone.git
cd whatsapp-web-clone
```

---

### 2️⃣ Set Up Backend

```bash
cd server
```

#### Install Dependencies
```bash
yarn install
```

#### Configure Environment
Create a `.env` file inside the `server` directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME = whatsapp
PORT=6009
CLIENT_URL=http://localhost:5173
```

#### Sync JSON Data to MongoDB

```bash
yarn sync
```

#### Start Backend Server
```bash
yarn dev
```

✅ The backend will be running at: **[http://localhost:6009](http://localhost:6009)**

---

### 3️⃣ Set Up Frontend

```bash
cd ../frontend
```

#### Install Dependencies
```bash
yarn install
```

#### Start Development Server
```bash
yarn dev
```

✅ The frontend will be running at: **[http://localhost:5173](http://localhost:5173)**


## 🛠️ Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
