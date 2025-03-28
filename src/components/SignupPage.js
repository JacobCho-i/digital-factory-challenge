import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // handles user sign up
  const handleSignup = async (e) => {
    e.preventDefault();

    // making sure both email and password field are filled
    if (!email || !password) {
      setError('Please fill in all fields.');
    } else if (!passwordCheck(password)) {
      setError('Have password length at least 5 characters and include number.');
    } else {

      try {
        //sending api to node.js backend
        const res = await axios.post('http://localhost:5000/api/register', {
          username: username,
          email: email,
          password: password
        });
        const data = await res.data;

        // store JWT token and email
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', data.user.username);
        console.log('Logged in as:', data.user);
        navigate('/');
      } catch (err) {
        window.alert(`Register failed: ${err.response?.data.msg}`);
      }
    }
  };

  const passwordCheck = () => {
    const hasMinimumLength = password.length >= 5;
    const hasNumber = /\d/.test(password);
  
    return hasMinimumLength && hasNumber;
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Container className="d-flex justify-content-center align-items-center">
          <Row>
            <Col>
              <Card className="p-4 shadow">
                <Card.Body>
                  <h3 className="text-center mb-4">Sign up</h3>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handleSignup}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                      Sign up
                    </Button>
                  </Form>
                </Card.Body>
                <Form.Label>Already have an account? <a href='/log-in'>Log in</a></Form.Label>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SignupPage;