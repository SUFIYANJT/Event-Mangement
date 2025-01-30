<<<<<<< HEAD
# Event-Mangement
Event-Mangement and control
=======
# React + TypeScript + Vite
Event Management System
Overview

The Event Management System is a web application that allows users to create, manage, and view events. This project is built using React for the frontend and Go for the backend with MySQL as the database.
Features

    Home Page: View a list of upcoming events.
    Event Detail Pages: Access detailed information about each event.
    Dashboard: A protected area for authenticated users to manage events, including creating, editing, and deleting events.

Technologies Used

    Frontend:
        React: Front-end library for building user interfaces.
        React Router v6.4: For handling navigation and routing.

    Backend:
        Go: Backend programming language.
        MySQL: Database for storing event data.

    Others:
        JSON Server: Simulates a mock backend for development purposes (only in the frontend setup).

Installation and Setup
Prerequisites

    Node.js (v14 or higher)
    npm or yarn package manager
    Go (v1.18 or higher)
    MySQL (v8 or higher)

Clone the Repository

git clonhttps://github.com/SUFIYANJT/Event-Mangement/
cd event-management-system

Install Frontend Dependencies

npm install

Set Up the Backend (Go + MySQL)

    Install Go and MySQL if not already installed.

    Set up MySQL Database:
        Create a database for events.
        Import the schema from the backend Go code (or create a table for events).

    Start the Go Backend:
        Navigate to the backend directory and run the Go application to start the server (ensure MySQL is running).

    go run main.go

        The backend will be running on a specific port (e.g., http://localhost:8080).

Set Up JSON Server (Optional for Mock Data)

If you want to use a mock backend (for frontend development), you can set up JSON Server:

npm install -g json-server
npx json-server --watch data/event.json --port 3003

Running the Application

    Start the React Development Server:

    In a separate terminal window, run the following command:

npm run dev

Navigate to: http://localhost:5173 to see the frontend in action.> 44cef5b (userpage)
Test users
username sufiyan1023
password sufiyan
in orgainzer
username: johhan1023
password:johhan123
