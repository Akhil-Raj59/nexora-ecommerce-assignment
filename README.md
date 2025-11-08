# 🛒 Nexora E-Commerce Cart - Full Stack Assignment

> A complete full-stack e-commerce shopping cart application built for Vibe Commerce internship screening.

## 🎯 Assignment Overview

Built a production-ready shopping cart system with user authentication, product management, cart operations, and mock checkout functionality.

## ✨ Features Implemented

### Core Requirements ✅
- **Product Catalog**: Browse 10 mock products with images and prices
- **Shopping Cart**: Add, remove, and update product quantities
- **Cart Management**: Real-time total calculation and cart persistence
- **Mock Checkout**: Generate order receipts with timestamps
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Bonus Features 🚀
- **User Authentication**: JWT-based register/login/logout with refresh tokens
- **Avatar Upload**: Cloudinary integration for profile pictures
- **Database Persistence**: MongoDB with user-specific carts
- **Error Handling**: Comprehensive validation and error messages
- **Protected Routes**: Secure cart and checkout endpoints
- **Auto Token Refresh**: Seamless authentication experience

## 🛠️ Tech Stack

**Frontend**: React 18 + Vite + TailwindCSS + React Router  
**Backend**: Node.js + Express + MongoDB + Mongoose  
**Authentication**: JWT (Access + Refresh Tokens) + bcrypt  
**File Upload**: Multer + Cloudinary  
**API Testing**: Postman

## 📁 Project Structure
```
nexora-assignment/
├── client/          # React frontend
├── server/          # Express backend
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (for avatars)

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd nexora-assignment

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Configuration

Create `.env` in `/server`:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run Application
```bash
# Terminal 1: Start backend (from /server)
npm run dev

# Terminal 2: Start frontend (from /client)
npm run dev
```

**Access**: http://localhost:5173

## 📸 Screenshots

[Add 4-5 key screenshots here]
- Login/Register page
- Products grid
- Cart with items
- Checkout & receipt

## 🎥 Demo Video

[📹 Watch Demo]() - 2-minute walkthrough

## 🔗 API Documentation

See [`/server/README.md`](./server/README.md) for complete API reference.

## 🏗️ Architecture Highlights

- **RESTful APIs** with proper HTTP methods and status codes
- **MVC Pattern** with controllers, models, and routes separation
- **JWT Authentication** with access and refresh token mechanism
- **Middleware** for auth verification and file uploads
- **Error Handling** with custom ApiError and ApiResponse classes
- **Database Relations** with user-cart associations

## 📦 Deliverables Checklist

- ✅ Full-stack application with React + Node.js
- ✅ All 5 core APIs implemented
- ✅ Responsive UI with cart operations
- ✅ Mock checkout with receipt generation
- ✅ Database persistence (MongoDB)
- ✅ Bonus: User authentication system
- ✅ GitHub repository with clean structure
- ✅ Comprehensive README with setup instructions
- ✅ Demo video (Loom/YouTube unlisted)

## 👨‍💻 Developer
 
📧 Email: your.email@example.com  
🔗 GitHub: [@Akhil-Raj-59](https://github.com/Akhil-Raj-59)

---