# React & Node.JS Course Management System REST API Web App

A basic React frontend web app & Node.JS backend server - course management system for students and professors.

## About The Application:

This API is a basic example of a REST API backend & frontend application.
It is build with Node.js and Express Framework at client side, React library at server side and Javascript.
In addition the application's database is MongoDB of the NoSQL type with the use of ODM like Mongoose.
Additionally the application has very basic authentication and authorization for management functionality with the use of JWT.

- Students can manage their attendance in courses that have already taken place, view the courses they are participating in and edit their personal information.
- Professors are considered the system administrators and can create/remove courses and students, edit their personal information and manage the courses (add/remove attendance of students from the course and overall attendance view).
- General users ( not logged in ) can view only the initial opening page (login form).

## Available Scripts:

In the client side project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

In the server side project directory, you can run:

### `npm run dev`

Opens the server and connects to the database.

**Note: In order to use the application, you need to open the server and make sure that there is a proper connection to the Internet for an optimal interface!**