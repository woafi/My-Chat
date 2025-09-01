# MyChat - Real-Time Chat Application

A full-stack real-time messaging application built with the MERN stack, featuring secure authentication, file sharing, and responsive design.

## Live Demo

**Demo Link**: [MyChat](https://my-chat-6blp.onrender.com) 

> **⚠️ Please Note**: The backend is hosted on a free service which spins down after inactivity. Your first request may take up to a minute to load as the server starts up.
>
```
Previously, JWT cookies were blocked on iOS Safari/Chrome because 
frontend and backend were on different domains. 
Now both are deployed on the same server, so cookies work as first-party 
and login works across all devices.
```


## Project Overview

MyChat is a modern, feature-rich chat application that enables users to communicate in real-time. The application provides a seamless messaging experience with user authentication, profile management, file sharing capabilities, and administrative controls. Built with scalability and user experience in mind, MyChat offers a responsive design that works across all devices with light and dark mode theme.

## Technology Used

### Frontend
- **React.js** - User interface framework
- **React Hook Form** - Form validation and handling
- **Toastify** - Toast notifications for user feedback
- **Tailwind CSS/Responsive Design** - Mobile-first responsive layout
- **Theme Management** - Light and dark mode implementation

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (JSON Web Tokens)** - Cookie-based authentication
- **Express Validator** - Server-side input validation

### Real-Time Communication
- **Socket.io** - WebSocket implementation for real-time messaging

### File Storage & Email Services
- **Cloudinary** - Image upload and storage
- **Nodemailer** - Email service for password recovery

### Deployment
- **Render** - Frontend and Backend deployment
- **MongoDB Atlas** - Cloud database hosting

## Key Features

### User Authentication & Management
- Secure user registration and login with JWT cookies
- Password recovery functionality via email
- Input validation on both client and server sides
- Admin-controlled user management and deletion

### Profile Management
- Personal profile pages with information
- Profile picture upload and management via Cloudinary
- User details viewing
<!-- - User details viewing and editing capabilities -->

### Real-Time Messaging
- Instant messaging with WebSocket.io integration
- Create conversations with other application users
- Send text messages and file attachments
- Real-time message delivery and status updates

### Conversation Management
- Conversation creation between users
- Delete conversations (creator and participants)
- Search functionality for finding specific conversations
- Message history and persistence

### User Experience
- Fully responsive web design
- Cross-platform compatibility
- Light and dark mode themes for enhanced user preference
- Toast notifications for real-time user feedback and alerts
- Intuitive user interface
- Real-time updates without page refresh

## Getting Started

### Prerequisites
- React (v18 or higher)
- Node.js (v14 or higher)
- Cloudinary account
- Email service for Nodemailer

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/woafi/My-Chat.git
   cd my-chat
   ```

2. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd Frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   # Application Configuration
   APP_NAME=MyChat
   PORT=5000

   #FRONTEND_URL
   APP_URL=http://localhost:3000
   
   # Database Configuration
   MONGO_CONNECTION_STRING=your_mongodb_connection_string_here
   
   # Security Configuration
   COOKIE_SECRET=your_cookie_secret_here
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRY=604800000
   COOKIE_NAME=my-chat-app

   # Email Service Configuration (Nodemailer)
   NODEMAILER_ID=your_nodemailer_app_password_here
   ```
   Create a `.env` file in the frontend directory:
   ```env
   # Frontend Environment Variables
   VITE_CLOUDINARY_KEY=your_cloudinary_key_here
   VITE_BACKEND_URL=http://localhost:5000
   ```


5. **Run the application**
   
   ```bash
   cd my-chat
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## Project Architecture

### MERN Stack Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React.js)    │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
│   - Components  │    │   - REST APIs   │    │   - Collections │
│   - State Mgmt  │    │   - Socket.io   │    │   - Indexes     │
│   - Routing     │    │   - Middleware  │    │   - Schemas     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Deployment    │    │   External      │    │   Cloud         │
│   - Vercel      │    │   Services      │    │   Services      │
│   - Static      │    │   - Render      │    │   - Atlas       │
│   - CDN         │    │   - APIs        │    │   - Backup      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## File Directory Structure

```bash
Chat-Application/
│
│── Backend/                  # Backend (Express + Node.js)
│   ├── controllers/          # Handles business logic for routes
│   ├── middlewares/          # Middleware (auth, error handling, etc.)
│   ├── models/               # Database models (e.g., User, Message)
│   ├── routers/              # Express route definitions
│   ├── utilities/            # Helper/utility functions
│   ├── .env                  # Environment variables
│   ├── example.env           # Example environment config
│   ├── index.js              # Entry point for backend server
│   ├── package.json          # Backend dependencies
│   └── package-lock.json
│
│── Frontend/                 # Frontend (React + Vite)
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   │   ├── Components/       # Reusable UI components
│   │   │   └── pages/        # Page-level components (Screens)
│   │   │      
│   │   ├── contexts/         # React Context API (global state)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── Styles/           # CSS/Styling files
│   │   ├── utils/            # Helper functions for frontend
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # React entry point
│   ├── .env                  # Frontend environment variables
│   ├── example.env           # Example env for frontend
│   ├── index.html            # Root HTML file
│   ├── vite.config.js        # Vite configuration
│   ├── package.json          # Frontend dependencies
│   └── package-lock.json
│
│── node_modules/             # Root dependencies
│── package.json              # Root-level dependencies
│── package-lock.json
└── README.md                 # Project documentation

```

### Key Components

#### Frontend Structure
- **Pages**: Main application pages (Login/sign up, Inbox, Profile, Users, Reset Password)
- **Services**: API communication and WebSocket management
- **Utils**: Helper functions like toast notifications

#### Backend Structure
- **Routes**: RESTful API endpoints for users, messages, and conversations
- **Models**: Mongoose schemas for User, Message, and Conversation
- **Middleware**: Authentication, validation, and error handling
- **Controllers**: Business logic for handling requests
- **Socket**: Real-time communication management

#### Database Schema
- **Users Collection**: User profiles, credentials, and metadata
- **Conversations Collection**: Chat room information and participants
- **Messages Collection**: Message content, timestamps, and references

## Conclusion

MyChat demonstrates a complete full-stack development approach using modern web technologies. The application successfully integrates real-time communication, secure authentication, file handling, and responsive design principles. With its scalable architecture deployed across reliable cloud services, MyChat provides a solid foundation for a production-ready messaging platform.

The project showcases proficiency in the MERN stack, real-time web technologies, cloud services integration, and modern development practices including form validation, security implementation, and responsive design.

## Contact

Mohammad Woafi - woafisun@yahoo.com
Project Link: [MyChat](https://my-chat-6blp.onrender.com)