import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TaskForm from './components/TaskForm';
import './App.css'

function App() {

  // routing with React Router
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<TaskForm />} />
          <Route path="/log-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
