import React, { useState, useEffect } from 'react';
import './App.css';

const axios = require('axios');
//load calendar
// let calendar = loadCalendar();

// function loadCalendar() {
//   //pull calendar from database and put to calendar
//   //parameters: none
//   //result: 2D calendar from database
// }

// function schedule(inName, dayIndex, slots) {
//   //name is name, dayIndex is monday/tuesday/wednesday, slots is an array of 
// }

function getDayIndex(id) {
  if (id === "M") {
    return 0;
  } else if (id === "Tu") {
    return 1;
  } else if (id === "W") {
    return 2;
  } else if (id === "Th") {
    return 3;
  } else if (id === "F") {
    return 4;
  } else {
    return -1;
  }
}

function getVolunteerFromID(id) {
  //get volunteer ID, return volunteer name
  axios.get('http://localhost:4200/getVolunteerName/' + id, {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  })
  .then( (response) => {
    return response.data.volunteerName;
  })
  .catch( (error) => {
    console.log("error in getVolunteerName: " + error);
  })




  if (id !== 0)
    return id;
} 

let username = "";

const Slot = ({userID}) => {
  const [busySetting, setBusySetting] = React.useState(String(inferBusy(userID)));
  const [uID, setuID] = React.useState(String(userID));
  function handleSlotClick(){
    // call Firebase to assign user id
    if(busySetting === "true"){
      setBusySetting("false");
    }
    else{
      setBusySetting("true"); 
    }
    console.log("hey");
  }
  return(
    <div className={"slot-" + busySetting} onClick={handleSlotClick}>
      {uID}
    </div>
  );
}

const Day = ({ids, header}) => {
  const slots = ids.map((item) => <Slot userID={item}></Slot>)
  return(
    <div className="day">
      <div className="header">
        {header}
      </div>

      <div className="slots">
       {slots}
      </div>
    </div>
  );
}

function inferBusy(id) {
  console.log(id);
  return (id === 0) ? false : true; 
}

const Calendar = () => {
  const headers = ["Mon", "Tues", "Wed", "Thur", "Fri"];
  const eventName = "Sample Event";
  const db = [[0, 1],[0, 0],[1, 0],[0, 0],[1, 1]];
  const numDays = db.length;
  const numSlots = db[0].length;
  const days = db.map((day) =>
      <Day ids={day} header="day"></Day>
    );
  return(
    <div className="calendar">
      {days}
    </div>
  );
};

const Login = () => {
  const [name, setName] = React.useState(username);
  function handleLogin() {
    if (document.getElementById("login").value === ""){
      return;
    }
    username = document.getElementById("login").value;
    setName(document.getElementById("login").value);
    axios.post("http://localhost:4200/newUser", {
      name: username,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
    .then((response) => {
      console.log("new user: " + username + " added");
    })
    .catch( (error) => {
      console.log("error at newUser " + error);
    });
  }
  return (
    <div>
      <form>
        <input id="login" type="text" placeholder="Login here..." /><br />
        <button onClick={handleLogin} type="button">Login</button>
      </form>
      <LoginInfo name={name}/>
    </div>
  );
}

const LoginInfo = ({name}) => ( ((name !== "") && (name != null)) ?
  <p>
    Signed in as: <br /> {name}
  </p>
  : <p></p>
);

const App = () => {
    return (
      <center>
      <br /><br />
      <div className="App">
        <table className="main-table">
        <tbody>
        <tr>
          <th>
            <div className="left-sidebar">
              <div className="logo"><h1>EasyVolunteer</h1></div>
              <Login />
            </div>
          </th>
          <th className="right-sidebar"><Calendar className="calendar" /></th>
        </tr>
      </tbody>
      </table>
      </div>
      </center>
    )
}

export default App;