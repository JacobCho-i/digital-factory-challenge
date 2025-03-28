
## Instruction (Running locally):

1. Switch to running_locally branch

2. Install node module using 

```
npm install
```
 
3. Install mongoDB from official website: https://www.mongodb.com/try/download/community-kubernetes-operator

4. create .env file in the root directory and copy paste these variables

```
PORT=3000
BACKEND_PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/todolist
JWT_SECRET=DMXSdlv9wHHiV+bBPAb5KA==
```

5. run mongoDB using command

```
mongod
```

(Might need to set up PATH environment variable if mongod is not recognized in terminal)

6. create another terminal, run the node backend using

```
cd src
node backend.js
```

7. create another terminal, run the react server

```
npm start
```

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

### Validation

Includes both client-side and server-side validation for authentication to make sure all fields are passed, have correct format, and check for duplicate users

## Backend API:

   - POST /api/register
   - POST /api/login
   - GET /api/tasks
   - POST /api/tasks
   - PUT /api/tasks/:id
   - DELETE /api/tasks/:id

## Testing

After installing all dependencies, you can test backend api with

```
npm test
```
