import Button from '@mui/material/Button';
import React, { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
    const [href, setHref] = useState('');

    useEffect(() => {
      const currentHref = window.location.href;
      setHref(currentHref);
    }, []);
  

  return (
    <>
      <nav className="navbar">
        <div className="brand">
          <a href='/'>
          My To-do list
          </a>
        </div>
        <div className="buttons">
            {href === "http://localhost:3000/" ?
            <>
            <a href='/sign-up'>
                <Button variant="outlined">Sign up</Button>
            </a>
            <a href='/log-in'>
                <Button variant="contained">Log in</Button>
            </a>
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