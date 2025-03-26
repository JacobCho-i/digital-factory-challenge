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
import axios from 'axios';
import { Input } from '@mui/material';


function Home() {

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [user, SetUser] = useState("null");

  useEffect(() => {
    SetUser(localStorage.getItem('user'));

    const getTasks = async () => {
      try {
        const token = localStorage.getItem('token'); 
        console.log('using token', token)
    
        const response = await axios.get('http://localhost:5000/api/task', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        console.log('User tasks:', response.data);
        setTodos(response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching tasks:', err.response?.data || err.message);
      }
    };

    if (user != null) {
      getTasks();
    }
    console.log(user);
  }, []);



  const add_task = async () => {
    if (inputValue === "") {
      return;
    }
    setInputValue('');

    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.post(
        'http://localhost:5000/api/task',
        { 
          content: inputValue 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('created user task:', response.data);
      console.log('created user task:', response.data.content);
      setTodos(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating tasks:', err.response?.data || err.message);
    }
  }

  const logout = () => {
    SetUser("null");
  }

  const deleteTask = async(id) => {
    setTodos(prev => prev.filter(task => task._id !== id));

    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.delete(
        `http://localhost:5000/api/task/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('deleted user task:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error creating tasks:', err.response?.data || err.message);
    }
  };

  const editTask = async(id) => {
    const content = window.prompt('Enter your memo:');

    if (!content || content.trim() === '') {
      return;
    }

    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.put(
        `http://localhost:5000/api/task/${id}`,
        { 
          content: content 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('edited user task:', response.data);
      setTodos((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, content: content } : task
        )
      );

      return response.data;
    } catch (err) {
      console.error('Error creating tasks:', err.response?.data || err.message);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <Navbar logout={logout} />
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
          <ListGroup class="tasks" style={{ paddingTop: '20px' }}>
            {todos.map((task) => (
              <ListGroup.Item key={task._id} style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                {task.content}
                <div style={{ display: 'flex', gap: '5px' }}>
                  <IconButton sx={{ color: '#8cc0ff' }} aria-label="edit" onClick={() => editTask(task._id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#ff7070' }} aria-label="delete" onClick={() => deleteTask(task._id)}>
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
          <Route path="/" element={<Home />} />
          <Route path="/log-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
