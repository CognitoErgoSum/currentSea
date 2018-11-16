import React, { Component } from 'react';
import './Header.css';
import { Link } from "react-router-dom";


export class Header extends Component{
  constructor(){
    super();
    this.state = {
      loggedIn : false
    };
  }
  render() {
      return(
        <nav>
        <div className = "navWide">
          <div className = "wideDiv">
          <Link to="/Accounts">My Accounts</Link>
          <Link to="/Reports/Report">View Reports</Link>
          <Link to="/Currencies/Currencies">My Currencies</Link>
          <Link to="/Login">Login/Signup</Link>
          <Link to="/Help">Help</Link>
          {/* deprecated
          <a href ="#"> Reports</a>
          <a href ="#"> Favorite Currencies</a>
          <a href ="#"> Help</a>*/}
        </div>
      </div>
      </nav>
    );
  }
};




//ReactDOM.render(<nav></nav>,document.querySelector('navbar'));
export default Header;