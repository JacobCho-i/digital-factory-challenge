TODOS:
- error handling
- unit test
- deployment
- validation
- change state management
- more documentations

## Components:

### LoginPage.js:

A page where user can log in with their credentials (email, password)

### SignupPage.js:

A page where user can register account with username, email, and password

### Navbar.js:

Navigation bar for guiding between main page, login page, and signup page

### TaskForm.js:

A page where user can view, create, update, or delete their todo items

## Features:

### User Authentication

Users can register with a username, email, and password and log in to their account with email and password

### Task management 

Logged in users can view, create, edit, and delete their tasks

### Responsive view

Todo list size and navigation bar change depending on phone or desktop use

### Data protection

User must be authorized (logged-in) to create, edit, and delete tasks, and user can only view their tasks

## Backend API:

   - POST /api/register
   - POST /api/login
   - GET /api/tasks
   - POST /api/tasks
   - PUT /api/tasks/:id
   - DELETE /api/tasks/:id


