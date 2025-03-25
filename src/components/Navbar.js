import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Navbar.css";

const Navbar = ({ logout }) => {
  const [href, setHref] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // load current href and current user if logged in
    const currentHref = window.location.href;
    setHref(currentHref);
    
    setUser(localStorage.getItem('user'));
  }, []);

  const signOut = async (e) => {
    e.preventDefault();
    localStorage.setItem('token', null);
    localStorage.setItem('user', null);
    setUser("null");
    logout();
  }

  return (
    <>
      <nav className="navbar">
        <div className="brand">
          <Link to='/'>
            My To-do list
          </Link>
        </div>
        <div className="buttons">
          {href === "http://localhost:3000/" ?
            <>
              {user !== "null" ? 
              <>
              hi {user}

              <Button variant="contained" onClick={signOut}>Sign OUT</Button>
              </>
              :
              <>
              <Link to='/sign-up'>
                <Button variant="outlined">Sign up</Button>
              </Link>
              <Link to='/log-in'>
                <Button variant="contained">Log in</Button>
              </Link>
            </>
              }
            </>
            :
            <></>
          }

        </div>

      </nav>
    </>

  );
}



export default Navbar;