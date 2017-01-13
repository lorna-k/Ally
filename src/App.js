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
          <input type="text" id="usr_input"></input>
          <input type="button" id="send_button"></input>
          </div>
    )
  }
}

export class Output extends Component{
  render(){
    return(
        <div className="Ally-replies">
        <div id="ally_message"></div>
        <div id="user_message"></div>
        </div>
    )
  }
}
