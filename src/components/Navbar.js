import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import "./Navbar.css";

const Navbar = ({ logout }) => {
  const [href, setHref] = useState('');
  const { user, setUser } = useUser();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // load current href and current user if logged in
    const currentHref = window.location.href;
    setHref(currentHref);


    const token = localStorage.getItem('token');
    if (!(isTokenExpired(token))) {
      setUser(localStorage.getItem('user'));
    } else {
      // log out user if token is expired
      setUser("null")
    }
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

  // clearing cached tokens and user on log out
  const signOut = async (e) => {
    e.preventDefault();
    localStorage.setItem('token', null);
    localStorage.setItem('user', null);
    setUser("null");
    logout();
  }

  return (
    <>
      <nav className="navbar" style={{ height: open ? '180px' : '68px', flexDirection: 'row', transition: 'all 0.3s ease' }}>
        <div className="brand">
          <Link to='/'>
            My To-do list
          </Link>
          {href === "https://digital-factory-challenge.vercel.app/" ?
            <button className="hamburgerButton" onClick={() => setOpen(!open)}>
              <svg
                className="hamburger"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            :
            <></>
          }
        </div>
        <div className="buttons">
          {href === "https://digital-factory-challenge.vercel.app/" ?
            <>
              {user !== "null" ? (
                <>
                  <div className='hide-on-mobile'>
                    hi {user}
                    <Button variant="contained" onClick={signOut}>Sign OUT</Button>
                  </div>

                  {open && (
                    <div className='hide-on-desk'>
                      hi {user}
                      <div><Button variant="contained" onClick={signOut}>Sign OUT</Button></div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className='hide-on-mobile'>
                    <Link to='/sign-up'>
                      <Button variant="outlined">Sign up</Button>
                    </Link>
                    <Link to='/log-in'>
                      <Button variant="contained">Log in</Button>
                    </Link>
                  </div>

                  {open ? <div className='log-in-mobile'>
                    <Link to='/sign-up'>
                      <Button variant="outlined">Sign up</Button>
                    </Link>
                    <Link to='/log-in'>
                      <Button variant="contained">Log in</Button>
                    </Link>
                  </div> : <></>}
                  <></>
                </>
              )}
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