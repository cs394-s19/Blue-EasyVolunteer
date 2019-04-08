import React from 'react';
import './App.css';

//load calendar
loadCalendar();
let testCalendarObject = [
  [0], //day 0 - monday
  [1],
  [0],
  [2],
  [0]
];

let globalCalendar;

function loadCalendar() {
  //pull calendar from database and put to globalCalendar
}

function schedule(inName, dayIndex) {

}

function getVolunteerFromID(id) {
  //to be implemented
  if(id === 1){
    return "Joseph";
  }
  else if (id === 2){
    return "Paul";
  }
  else if (id === 0){
    return "";
  }
  return "Other";
} 

let username = "";

const Day = ({day, busy, name}) => {
  let originalName = name;
  const [busySetting, setBusySetting] = React.useState(String(busy));
  const [dynamicName, setDynamicName] = React.useState(originalName);
  function handleDayClick () {
    if(busySetting === "false"){ //if not busy
      if(username === ""){ //if not logged in
        alert("You are not logged in!");
        return;
      }
      else { //if logged in
        setDynamicName(username);
        busy = !busy;
        setBusySetting(String(busy));
      }
    } else { //if busy
      if(username === ""){
        return;
      } 
      else {
        if(dynamicName === username){
          busy = !busy;
          setBusySetting(String(busy));
          if (busy === false){
            setDynamicName("");
          }
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
      <td onClick={handleDayClick} className={busySetting}>{dynamicName}</td>
    </tr>
    </tbody>
  </table>
  );
}

function inferBusy(id) {
  return (id !== 0) ? true : false; 
}

const Calendar = () => (
  <table className="calendar">
    <tbody>
    <tr>
      <th><Day day="M" busy={inferBusy(testCalendarObject[0][0])} name={getVolunteerFromID(testCalendarObject[0][0])}></Day></th>
      <th><Day day="Tu" busy={inferBusy(testCalendarObject[1][0])} name={getVolunteerFromID(testCalendarObject[1][0])}></Day></th>
      <th><Day day="W" busy={inferBusy(testCalendarObject[2][0])} name={getVolunteerFromID(testCalendarObject[2][0])}></Day></th>
      <th><Day day="Th" busy={inferBusy(testCalendarObject[3][0])} name={getVolunteerFromID(testCalendarObject[3][0])}></Day></th>
      <th><Day day="F" busy={inferBusy(testCalendarObject[4][0])} name={getVolunteerFromID(testCalendarObject[4][0])}></Day></th>
    </tr>
    </tbody>
  </table>
);

const Login = () => {
  const [name, setName] = React.useState(username);
  function handleLogin() {
    if (document.getElementById("login").value === ""){
      return;
    }
    username = document.getElementById("login").value;
    setName(document.getElementById("login").value);
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
