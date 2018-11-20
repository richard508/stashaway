import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const NavBarStyles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0a0f20;
  height: 50px;
  
  a {
    text-decoration: none;
    padding-left: 10px;
    color: white;
    &:active {
      color: red;
    }
  }

  .right {
    width: 15vw;
    display: flex;
    justify-content: space-around;
  }
  .logo{
    margin-left: 10px;
    padding: 5px;
    color: #8398d9;
    font-weight: bold;
    font-size: 20px;
    border: 1px solid #8398d9;
  }
`

class NavBar extends Component {
  render() {
    return (
      <NavBarStyles id="nav-container">
        <p className="logo">STASHaWAY</p>
        <div className="right">
          <Link to="/">Logout</Link>
        </div>
      </NavBarStyles>
    );
  }
}

export default NavBar;
