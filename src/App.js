import React, { Component } from 'react';
import './App.css';

export class Header extends Component
{
  render()
  {
    return(
      <div className="Header">
      <h1>Ally</h1>
      <img src="https://www.allangray.co.za/static/images/AG-Logo.png" id="logo" alt="hello"></img>
      </div>
    )
  }
}
export class Input extends Component {
  render()
  {
    return(
        <div className="Text-field">
          <input type="text" id="text"></input>
          <input type="submit" id="submit"></input>
      </div>
    )
  }
}

export class Output extends Component{
  render(){
    return(
        <div className="Ally-replies">
          
        </div>

    )
  }
}
