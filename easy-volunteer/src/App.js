import React, { useState, useEffect } from 'react';
import { firebase } from './firebaseConfig';
import { Form, Button } from 'semantic-ui-react';
import './App.css';
import logo from './assets/logo2.svg'


const Slot = ({currentUser, eventID, slotNum, header, loggedInUser}) => {

  /*
    props:
      currentUser - the user's name that's currently occupying the timeslot. 0 if time slot is free
      eventID - the id for the event in firebase
      slotNum - the index for the slot
      header - the header for the day. used to index the day in firebase
      loggedInUser - the name of the user currently logged in the machine
  */

  const  inferBusy = (id) => {
    return (id !== 0);
  }

  const [busySetting, setBusySetting] = useState(inferBusy(currentUser));

  // rn, the information for updating the users name is happening on the client side. will implement realtime updates after
  // the core functionality works.
  const [displayed, setDisplayed] = useState(currentUser ? currentUser : "");

  const handleSlotClick = () => {
    let database = firebase.database();
    if (loggedInUser && !busySetting) {
      console.log("setting user");
      database.ref('Events/' + eventID + '/Calendar/' + header + '/slot' + slotNum).set(loggedInUser);
      setBusySetting(true);

      setDisplayed(loggedInUser);
    }
    else if ((loggedInUser === currentUser)) {
      setBusySetting(false);
      database.ref('Events/' + eventID + '/Calendar/' + header + '/slot' + slotNum).set(0);

      setDisplayed("");
    }
  }

  return(
    <div className={busySetting ? "slot-true" : "slot-false"} onClick={() => handleSlotClick()}>
      {displayed}
    </div>
  );
}

const Day = ({ids, header, eventID, loggedInUser}) => {
  /*
    props:
      ids- array of names occupying each time slot for that day
      eventID - the id for the event in firebase
      header - the header for the day. used to index the day in firebase
      loggedInUser - the name of the user currently logged in the machine
  */

  const slots = ids.map((item, key) => <Slot header={header} eventID={eventID} slotNum={key} currentUser={item} loggedInUser={loggedInUser}></Slot>)
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


const Calendar = ({eventID, userName}) => {
  const [headers, setHeaders] = useState([]);
  const [eventName, setEventName] = useState("");
  const [calendar, updateCalendar] = useState([[]]);

  useEffect(() => {
    let database = firebase.database();
    let ref = database.ref('Events/' + eventID + '/Calendar/');
    ref.on('value', (snapshot) => {
      let fullCalendar = [];
      let tempHeaders = [];
      let calDict = snapshot.val();
      for (let key in calDict) {
        if (calDict[key]) {
          let days = [];
          tempHeaders.push(key);
          for (let slot in calDict[key]) {
            days.push(calDict[key][slot])
          }
          fullCalendar.push(days);
        }
      }
      updateCalendar(fullCalendar);
      setHeaders(tempHeaders);
    });


      let eventNameRef = database.ref('Events/' + eventID);
      eventNameRef.once('value', (snapshot) => {
        setEventName(snapshot.val()['eventName']);
      });
    }, []);


  return(
    <div className="calendar">
    <h1>{eventName}</h1>
      <div className="allDays">
      {(calendar.length) > 0 ?
      calendar.map((day, key) => <Day loggedInUser={userName} ids={day} eventID={eventID} header={headers[key]}>></Day>) : <div></div>
    }
      </div>
    </div>
  );
}



const App = ({ match }) => {
  /*
    props:
      match - used to get the eventID from the URL
  */

  const [name, setName] = useState("");
  const [isLogged, toggleLogged] = useState(false);
  const handleSubmit = () => {
    toggleLogged(true);
  }
    return (
      <center>
      <br /><br />
      <div className="App">
          <div className="logoDiv">
            <img className="logo" src={logo} alt="logo" />
          </div>

          <div>
            <Calendar userName={isLogged ? name : false} eventID={match.params.id} className="calendar" />
          </div>

              <div className="loginDiv">
                <div className="loginFormDiv">
                <Form onSubmit={() => handleSubmit()}>
                <Form.Group>
                  <Form.Input size='large' onChange={(e, {value}) => setName(value)} width={8} fluid placeholder="Enter name" />
                  <Button primary type='submit'>Login</Button>
                </Form.Group>
                </Form>
                {isLogged ? <p>{name} is logged in!</p> : <p>Please log in.</p>}
                </div>
              </div>
      </div>
      </center>
    )
}

export default App;
