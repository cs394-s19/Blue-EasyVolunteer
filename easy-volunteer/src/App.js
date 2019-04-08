import React, {useState, useEffect} from 'react';
import './App.css';

const days = [
  ["M",false,"false"],
  ["Tu",true,"James"],
  ["W",false,"false"],
  ["Th",false,"false"],
  ["F",false,"false"]]; //we'd figure out how to get this from backend

let calendarObject;
var xmlhttp = new XMLHttpRequest();
var url = "https://www.w3schools.com/js/myTutorials.txt";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

let loggedIn = false;
let username;

const Day = ({day, busy, name}) => {
  let origName = (name === "false") ? "" : name;
  const [busySetting, setBusySetting] = React.useState(String(busy));
  const [nome, setNome] = React.useState(origName);
  function handleDayClick () {
    if ((busy == true) && (name === origName)) {return;}
    if (username === "") {return;}
    busy = !busy;
    if(busy == true){
      name = username;
    }
    else {
      name = origName;
    }
    setNome(name);
    setBusySetting(String(busy));
  }
  return (
   <table className="day"><tbody>
    <tr>
      <th className="day-header">{day}</th>
    </tr>
    <tr>
      <td onClick={handleDayClick} className={busySetting}>{nome}</td>
    </tr>
    </tbody>
  </table>
  );
}

const Calendar = ({DaysArray}) => (
  <table className="calendar">
    <tbody>
    <tr>
      <th><Day day={DaysArray[0][0]} busy={DaysArray[0][1]} name={DaysArray[0][2]}></Day></th>
      <th><Day day={DaysArray[1][0]} busy={DaysArray[1][1]} name={DaysArray[1][2]}></Day></th>
      <th><Day day={DaysArray[2][0]} busy={DaysArray[2][1]} name={DaysArray[2][2]}></Day></th>
      <th><Day day={DaysArray[3][0]} busy={DaysArray[3][1]} name={DaysArray[3][2]}></Day></th>
      <th><Day day={DaysArray[4][0]} busy={DaysArray[4][1]} name={DaysArray[4][2]}></Day></th>
    </tr>
    </tbody>
  </table>
);



const Login = () => {
  const [nome, setNome] = React.useState(username);

  return (
    <div>
      <form>
        <input id="login" type="text" placeholder="Login here..." /><br />
        <button onClick={() => {setNome(document.getElementById("login").value); localStorage.setItem("easyVolunteerName",document.getElementById("login").value); username = document.getElementById("login").value;}} type="button">Login</button>
      </form>
      <LoginInfo name={nome}/>
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
    loggedIn = localStorage.getItem("easyVolunteerLoggedIn");
    if(loggedIn === "true") {
      username = localStorage.getItem("easyVolunteerName");
    }
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
          <th className="right-sidebar"><Calendar className="calendar" DaysArray={days}/></th>
        </tr>
      </tbody>
      </table>
      </div>
      </center>
    )
}

export default App;

