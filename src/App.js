import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './App.css'
import { Input } from '@mui/material';


function Home() {

  const [todos, setTodos] = useState(['go walk dog', 'do laundry', 'wash dishes', 'clean bathroom']);
  const [inputValue, setInputValue] = useState('');
  const [user, SetUser] = useState("null");

  useEffect(() => {
    SetUser(localStorage.getItem('user'));
    console.log(user);
  }, []);

  const add_task = () => {
    if (inputValue === "") {
      return;
    }
    setInputValue('');
    setTodos(prev => [...prev, inputValue]);
  }

  const logout = () => {
    SetUser("null");
  }

  const deleteTask = (indexToDelete) => {
    setTodos(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <Navbar logout={logout}/>
      {user !== "null" ? 
            <div class="mainboard">
            <div>
              <Input
                value={inputValue}
                onChange={handleChange}
                placeholder="Type task..."
              />
              <Button onClick={() => add_task("ball guy")}>add</Button>
            </div>
            <ListGroup class="tasks" style={{ paddingTop: '20px'}}>
              {todos.map((task, index) => (
                  <ListGroup.Item key={index} style={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}>
                  {task}
                  <div style={{display: 'flex', gap: '5px'}}>
                    <IconButton sx={{ color: '#8cc0ff' }} aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#ff7070' }} aria-label="delete" onClick={() => deleteTask(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ListGroup.Item>
              )
              )}
            </ListGroup>
          </div>
      :
      <div class="not-logged-in">Log in to view your todo list!</div>
      }


      

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
