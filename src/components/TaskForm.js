import '../App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useUser } from '../contexts/UserContext';
import { Input } from '@mui/material';

function TaskForm() {

    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const { user, setUser } = useUser();

    useEffect(() => {
        setUser(localStorage.getItem('user'));

        // load tasks for logged in users
        const getTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('using token', token)
                if (isTokenExpired(token)) {
                    console.log('token expired');
                    setUser("null");
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/task', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('User tasks:', response.data);
                setTodos(response.data);
                return response.data;
            } catch (err) {
                window.alert(`Error fetching tasks: ${err.response?.data.msg}`);
            }
        };
        if (user != null) {
            getTasks();
        }
        console.log(user);
    }, []);

    // function to check if JWT token is expired
    const isTokenExpired = (token) => {
        if (!token || token === "null") return true;

        const payloadBase64 = token.split('.')[1];
        const payloadJson = atob(payloadBase64);
        const payload = JSON.parse(payloadJson);

        const currentTime = Math.floor(Date.now() / 1000); 

        return payload.exp < currentTime;
    }

    // sending api to add a task
    const addTask = async () => {
        // make sure user enter a value
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
            window.alert(`Error creating tasks: ${err.response?.data.msg}`)
        }
    }

    const logout = () => {
        setUser("null");
    }

    // sending api to delete a task
    const deleteTask = async (id) => {
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
            window.alert(`Error deleting tasks: ${err.response?.data.msg}`)
        }
    };

    // sending api to edit a task
    const editTask = async (id) => {
        const content = window.prompt('Enter your memo:');
        // make sure user enter a value
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
            window.alert(`Error editting tasks: ${err.response?.data.msg}`)
        }
    };

    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <Navbar logout={logout} />
            <div className="app-background">
                <div className="content">
                    {user !== "null" ?
                        <div class="mainboard">
                            <div>
                                <Input
                                    value={inputValue}
                                    onChange={handleChange}
                                    placeholder="Type task..."
                                />
                                <Button onClick={() => addTask("ball guy")}>add</Button>
                            </div>
                            <ListGroup class="tasks" style={{ paddingTop: '20px' }}>
                                {todos.map((task) => (
                                    <ListGroup.Item className="custom-item" key={task._id}>
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
                <div className="bottom-spacing" />
            </div>

        </>
    );
}

export default TaskForm;