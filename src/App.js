import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import './App.css'
import { Input } from '@mui/material';


function Home() {

  const [todos, setTodos] = useState(['go walk dog', 'do laundry', 'wash dishes', 'clean bathroom']);
  const [inputValue, setInputValue] = useState('');

  const add_task = () => {
    if (inputValue === "") {
      return;
    }
    setInputValue('');
    setTodos(prev => [...prev, inputValue]);
  }

  const deleteTask = (indexToDelete) => {
    setTodos(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <Navbar/>
      <div class="mainboard">
        <div>
          <Input
            value={inputValue}
            onChange={handleChange}
            placeholder="Type task..."
          />
          <button onClick={() => add_task("ball guy")}>add</button>
        </div>
        <ListGroup class="tasks" style={{ paddingTop: '20px'}}>
          {todos.map((task, index) => (
              <ListGroup.Item key={index} style={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}>
              {task}
              <div style={{display: 'flex', gap: '5px'}}>
                <button>edit</button>
                <button onClick={() => deleteTask(index)}>delete</button>
              </div>
            </ListGroup.Item>
          )
          )}
        </ListGroup>
      </div>

      

    </div>
  );
}

function App() {

  // routing with React Router
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/log-in" element={<LoginPage/>} />
          <Route path="/sign-up" element={<SignupPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
