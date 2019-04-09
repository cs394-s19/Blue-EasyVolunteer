import React, { useState, useEffect } from 'react';
import logo from './assets/logo2.svg'
import './semantic/dist/semantic.min.css';
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

const Day = ({day, busy, name}) => {
  const originalName = name;
  const [busySetting, setBusySetting] = React.useState(String(busy));
  const [dynamicName, setDynamicName] = React.useState(originalName);

  function displayName(dynName,name)
  {
    if(dynName === 0)
    {
      if (name === 0){
        return "";
      }
      return name;
    }
    else
    {
      return dynName;
    }
  }


  function handleDayClick() {
    if(busySetting === "false"){ //if not busy
      if(username === ""){ //if not logged in
        alert("You are not logged in!");
        return;
      }
      else { //if logged in
        setDynamicName(username);
        busy = !busy;
        setBusySetting(String(busy));

        ////////// start of backend part ////////////////
        //console.log(username);
        axios.get('http://localhost:4200/getVolunteerID/' + username, {
          headers: {
            'Content-type': 'application/json'
          }
        })
        .then( (response) => {
          axios.post('http://localhost:4200/updateSchedule', {
            volunteerID: response.data.volunteerID,
            eventID: 1,
            times: [true],
            dayIndex: getDayIndex(day),
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            }
          })
          .then(function (response) {
            console.log("database updated");
          })
          .catch(function (error) {
            console.log("error in updateSchedule: " + error);
          });
        })
        .catch ( (error) => {
          console.log("error in getVolunteerID: " + error);
        });

        //////////////// end of backend part ////////////////
      }
    } else { //if busy
      if(username === ""){
        return;
      }
      else {
        if (dynamicName === username) {
          busy = !busy;
          setBusySetting(String(busy));
          if (busy === false) {
            setDynamicName("");
          }

          ////////// start of backend part ////////////////
          axios.get('http://localhost:4200/getVolunteerID/' + dynamicName, {
            headers: {
              'Content-type': 'application/json'
            }
          })
          .then( (response) => {
            axios.post('http://localhost:4200/updateSchedule', {
              volunteerID: response.data.volunteerID,
              eventID: 1,
              times: [false],
              dayIndex: getDayIndex(day),
              headers: {
                'Content-type': 'application/x-www-form-urlencoded'
              }
            })
            .then(function (response) {
              console.log("database updated");
            })
            .catch(function (error) {
              console.log("error in updateSchedule: " + error);
            });
          })
          .catch ( (error) => {
            console.log("error in getVolunteerID: " + error);
          });

          //////////////// end of backend part ////////////////
        } else {
          return;
        }
      }
    }
  }
  return (
   <table className="day"><tbody>
    <tr>
      <th className="day-header">{day}</th>
    </tr>
    <tr>
      <td onClick={handleDayClick} className={busySetting}>{displayName(dynamicName,name)}</td>
    </tr>
    </tbody>
  </table>
  );
}

function inferBusy(id) {
  console.log(id);
  return (id === 0) ? false : true;
}

const Calendar = () => {
  let initialCalendar = [[0],[0],[0],[0],[0]];
  const [calendar, setCalendar] = useState(initialCalendar);

  //////// backend route ////////////////////////
  useEffect(() => {
    axios.get('http://localhost:4200/getCalendar/1', {
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    })
      .then( (response) => {
        // handle success
        console.log(response.data.calendar); // the 2d calendar array, each value is a volunteerID
        setCalendar(response.data.calendar);
        console.log(calendar);

      })
      .catch(function (error) {
        // handle error
        console.log("error in getCalendar" + error);
      });
  }, []);

  function getUserIDs()
  {

  }

  /////////////////// end back-end route ///////////////////////////
  return (
  <table className="calendar">
    <tbody>
    <tr>
      <th><Day day="M" busy={inferBusy(calendar[0][0])} name={calendar[0][0]}></Day></th>
      <th><Day day="Tu" busy={inferBusy(calendar[1][0])} name={calendar[1][0]}></Day></th>
      <th><Day day="W" busy={inferBusy(calendar[2][0])} name={calendar[2][0]}></Day></th>
      <th><Day day="Th" busy={inferBusy(calendar[3][0])} name={calendar[3][0]}></Day></th>
      <th><Day day="F" busy={inferBusy(calendar[4][0])} name={calendar[4][0]}></Day></th>
    </tr>
    </tbody>
  </table>
  )
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
      <form class="form">
        <input class="ui icon input login" id="login" type="text" placeholder="Login here..." />
        <button class="ui primary button login" onClick={handleLogin} type="button">Login</button>
        <LoginInfo name={name}/>
      </form>

    </div>
  );
}

const LoginInfo = ({name}) => ( ((name !== "") && (name != null)) ?
  <p>
    Signed in as: {name}
  </p>
  : <p></p>
);

const App = () => {
    return (
      <center>
      <br /><br />
      <div className="App">

        <div className="logoDiv">
          <img className="logo" src={logo} alt="logo" />
        </div>

        <div className="calendarDiv">
          <Calendar className="calendar" />
        </div>

        <div className="loginDiv">
          <Login />


        </div>

      </div>
      </center>
    )
}

export default App;
