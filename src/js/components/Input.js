import React from 'react';
import './Messaging.css';
import ReactDOM from "react-dom";
import MessageHistory from "./MessageHistory.js";
import timer from './Time.js';
import Options from "./Options.js";
import FundList from "./FundList.js";
import DataList from "./DataList.js";
import mic from './microphone-black-shape.svg';
//var speech =require("native-speech");

export var io = require("socket.io-client");

export var socket = io.connect("http://localhost:3001", {
  "force new connection": true,
  "reconnectionAttempts": "Infinity",
  "timeout": 1000,
  "transports": ["websocket"]
});

///////////////////////////////////////////////////////////////////////////////
var messages = [];
var recognizing = false;
var user_message = "";
var recognition = null;

if (!('webkitSpeechRecognition' in window) && !('mozSpeechRecognition' in window))
{
  console.log("Web Speech API is not supported.");
}
else
{
  recognition = window.webkitSpeechRecognition || window.mozSpeechRecognition;
  console.log("Web Speech API loaded...");
  recognition.continuous = true;
  recognition.onend = reset();

  recognition.onresult = function (event)
  {
    for (var i = event.resultIndex; i < event.results.length; ++i)
    {
      if (event.results[i].isFinal)
      {
        //textarea.value += event.results[i][0].transcript;
        user_message = event.results[i][0].transcript;
        console.log(user_message);

        let user_mssg = {
          message: user_message,
          from: "user",
          id: socket.id,
          time: timer.chaTime()
        };

        if(user_mssg.message !== undefined)
        {
          socket.emit("user_message", user_mssg);
          messages.push(user_mssg);
          var elem = <MessageHistory messages={messages} />;
          ReactDOM.render(elem, document.getElementById("message_box"));
        }
      }
    }
  }
}

function reset()
{
  recognizing = false;
}

function toggleStartStop()
{
  console.log("Mic toggleStartStop called.");
  if (recognition)
  {
    if (recognizing)
    {
      recognition.stop();
      reset();
    }
    else
    {
      recognition.start();
      recognizing = true;
    }
  }
}


///////////////////////////////////////////////////////////////////////////////

var Input = React.createClass ({

  getInitialState() {
    return( {inputValue: ""} );
  },

  componentDidMount()
  {
    socket.on("server_message", (msg) => {
      let server_message = {
        message: msg,
        from: "server",
        time: timer.chaTime()
      };

      if (server_message.message === "unknown")
      {
        let extra_message = {
          message: "To find out more information, " +
            "please choose one of the options below :)",
          from: "server",
          time: timer.chaTime()
        };
        messages.push(extra_message);
        server_message.message = <Options />;
      }
      else if (server_message.message === "show_accounts")
      {
        server_message.message = <FundList />;
      }
      else if (/show_data/.test(server_message.message))
      {
        var msg_split = server_message.message.split(":");
        server_message.message = <DataList account={msg_split[1]}/>;
      }

       messages.push(server_message);
      var elem = <MessageHistory messages={messages} />;
      ReactDOM.render(elem, document.getElementById("message_box"));
    });

    socket.on("client-to-self", (msg) =>
    {
      let message = {
        message: msg,
        from: "user",
        time: timer.chaTime()
      }

      messages.push(message);
      var elem = <MessageHistory messages={messages} />;
      ReactDOM.render(elem, document.getElementById("message_box"));
    });
  },

  onKeyPress(event) {
    if (event.key !== "Enter") {
      return;
    }

    if (!(/\S/.test(this.state.inputValue)))
    {
      return;
    }

    // Store user input in variable
    var msg = this.state.inputValue;

    // Compile message var to send then emit to server
    let message = {
      message: msg,
      from: "user",
      id: socket.id,
      time: timer.chaTime()
    };
    socket.emit("user_message", message);

    // Clear user input after emitting to socket
    this.setState( {inputValue: ""} );
  },

  handleChange(event) {
    this.setState( {inputValue: event.target.value} );
  },

  render()
  {
    return(
      <div className="row">
        <div className="col-xs-1"></div>
        <div className="col-xs-10">
          <div className="row">
                <input className="col-xs-10 Text-field"
                    placeholder="Type message..." id="usr_input"
                    type="text" value={this.state.inputValue}
                    onChange={this.handleChange} onKeyPress={this.onKeyPress}/>
                <button className="mic-button" onClick={toggleStartStop}>
                  <img alt="Record Voice Note" src={mic} />
                </button>
          </div>
        </div>
        <div className="col-xs-1"></div>
      </div>
    )
  }
});

export default Input;
