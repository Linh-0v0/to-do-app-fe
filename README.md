# To-Do App Frontend

A task management application built with React, TypeScript, and Vite. This frontend connects to the To-do_app backend to provide a complete task management solution with authentication, notifications, and robust task management capabilities.

## Features

### User Authentication

- Multiple authentication methods:
  - Email/password sign-up and login
  - Google authentication via Firebase
- Secure token management with JWT
- Password change functionality
- Profile management

### Task Management

- Create, view, update, and delete tasks
- Set task due dates and reminders
- Mark tasks as important (priority)
- Mark tasks as complete/incomplete
- Recurring tasks (daily, weekly, monthly, yearly)
- Filter tasks by status and priority
- Search tasks by title and description
- Grid and list view options

### Notifications

- Push notifications via Firebase Cloud Messaging (FCM)
- One-time and recurring reminders
- Browser notifications for task reminders

### User Interface

- Modern, responsive design with Tailwind CSS
- Intuitive task creation and editing
- Profile management section
- Toast notifications for user feedback
- Date and time pickers for scheduling

## Tech Stack

- **React** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool
- **React Router** - Routing
- **Zustand** - State management
- **Axios** - API client
- **Firebase** - Authentication and notifications
- **Tailwind CSS** - Styling
- **Sonner** - Toast notifications
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **shadcn/ui** - UI component library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Authentication and Cloud Messaging enabled
- Backend service running (To-do_app)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_FIREBASE_VAPID_KEY=your_firebase_vapid_key
```

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/to-do-app-fe.git
cd to-do-app-fe
```

2. Install dependencies:

```sh
npm install
# or
yarn install
```

### Running the Application

To start the development server:

```sh
npm run dev
# or
yarn dev
```

Open your browser and navigate to `http://localhost:5173`.

## Building for Production

To build the application for production:

```sh
npm run build
# or
yarn build
```

The build output will be in the `dist` directory.

## Project Structure

```
├── public/              # Static files
│   └── firebase-messaging-sw.js  # Service worker for FCM
├── src/
│   ├── components/      # Reusable components
│   │   ├── auth/        # Authentication components
│   │   ├── layout/      # Layout components
│   │   ├── tasks/       # Task-related components
│   │   └── ui/          # UI components
│   ├── lib/
│   │   ├── api/         # API client and interceptors
│   │   ├── services/    # Service modules
│   │   ├── store/       # Zustand stores
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── pages/           # Application pages
│   │   ├── auth/        # Authentication pages
│   │   ├── profile/     # User profile pages
│   │   └── tasks/       # Task management pages
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

