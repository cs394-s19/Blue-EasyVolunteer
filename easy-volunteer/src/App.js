import React, { useState, useEffect } from 'react';
import { firebase } from './firebaseConfig';
import { Form, Button } from 'semantic-ui-react';
import './App.css';
import logo from './assets/logo2.svg'

const MyTimesModal = ({ children }) => (
  ReactDOM.createPortal(
    <div className="MyTimesModal">
      {children}
    </div>,
    document.getElementById('modal-root')
  )
);

const MyTimesFunctional = ({ toggle, content }) => {
  const [isShown, setIsShown] = useState(false);
  const hide = () => setIsShown(false);
  const show = () => setIsShown(true);

  return (
    <React.Fragment>
      {toggle(show)}
      {isShown && content(hide)}
    </React.Fragment>
  );
};


// Doesn't update on slot click
// Time not shown yet -> use getTimeLabels
const MyTimesButton = ({eventID, userName}) => {
  const handleMyTimes = () => {
    let allDaysWithShifts = [];
    let userNameShifts = [];

    let database = firebase.database();
    let ref = database.ref('Events/' + eventID + '/Calendar/');
    ref.once('value', (snapshot) => {
      snapshot.forEach((child) =>  {
        if (child.val() !== false){
          allDaysWithShifts.push(child);
        }
      })
    });

    allDaysWithShifts.forEach((day) => {
      let userNameShiftsHelper = [];
      userNameShiftsHelper.push(day.key);
      day.forEach((shift) => {
        if (shift.val() === userName) {
          userNameShiftsHelper.push(shift.key)
          userNameShiftsHelper.push(shift.val())
        }
      });

      if (userNameShiftsHelper.length > 1){
        userNameShifts.push(userNameShiftsHelper);
      }
    });

    return userNameShifts;
  };

  const myTimes = handleMyTimes();

  return(
    <div className="MyTimesContainer">  
      <MyTimesFunctional
        toggle = {(show) => <Button className="closeMyTimesModal" primary type='button' onClick={show}>See your shifts</Button>}
        content = {(hide) => (
          <MyTimesModal>
            Here are your shifts: {
              myTimes.map((shift) => <div className="MyTimesShifts">{shift}</div>
            )}
            <Button className="closeMyTimesModal" primary type='button' onClick={hide}>Close</Button>
          </MyTimesModal>
        )}
      />
    </div>
  );
}


const Slot = ({occupyingUser, eventID, slotNum, header, loggedInUser}) => {

  /*
    props:
      occupyingUser - the user's name that's currently occupying the timeslot. 0 if time slot is free
      eventID - the id for the event in firebase
      slotNum - the index for the slot
      header - the header for the day. used to index the day in firebase
      loggedInUser - the name of the user currently logged in the machine
  */

  const  inferBusy = (id) => {
    return (id !== 0);
  }

  const [busySetting, setBusySetting] = useState(inferBusy(occupyingUser));

  // rn, the information for updating the users name is happening on the client side. will implement realtime updates after
  // the core functionality works.
  const [displayed, setDisplayed] = useState(occupyingUser ? occupyingUser : "");

  const handleSlotClick = () => {
    let database = firebase.database();
    if (loggedInUser && !busySetting) {
      console.log("setting user");
      database.ref('Events/' + eventID + '/Calendar/' + header + '/slot' + slotNum).set(loggedInUser);
      setBusySetting(true);

      setDisplayed(loggedInUser);
    }
    else if ((loggedInUser === occupyingUser)) {
      setBusySetting(false);
      database.ref('Events/' + eventID + '/Calendar/' + header + '/slot' + slotNum).set(0);

      setDisplayed("");
    }
    if(!loggedInUser) {
      alert("You must log in to pick up a shift.");
    }
  }

  const getSlotClassName = () =>
  {
    if(busySetting)
    {
      if(occupyingUser === loggedInUser)
      {
        console.log("yellow");
        return "slot-user";
      }
      return "slot-others";
    }
    else
    {
      return "slot-free";
    }
  }

  return(
    <div className={getSlotClassName()} onClick={() => handleSlotClick()}>
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

  const slots = ids.map((item, key) => <Slot header={header} eventID={eventID} slotNum={key} occupyingUser={item} loggedInUser={loggedInUser}></Slot>)
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
  const [start, getStart] = useState(0);
  const [end, getEnd] = useState(0);


  const DaysOfWeek = {Sunday: 0,Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6};

  const DayComparer = (day1,day2) =>
  {
    return DaysOfWeek[day1] > DaysOfWeek[day2] ? 1 : -1;
  }

  const generateDayTupleArray = (calendarDict,compare=DayComparer) =>
  {
    return Object.keys(calendarDict)
    .map(day => [day,calendarDict[day]])
    .sort((day1,day2) => compare(day1[0],day2[0]))
    .filter(dayTuple => dayTuple[1]);
  }

  useEffect(() => {
    const database = firebase.database();
    const ref = database.ref('Events/' + eventID + '/Calendar/');
    ref.on('value', (snapshot) => {
      let fullCalendar = [];
      let tempHeaders = [];
      const dayTuples = generateDayTupleArray(snapshot.val());
      dayTuples.map(dayTuple =>
      {
        const dayObject = dayTuple[1];
        const dayName = dayTuple[0];
        let days = [];
        tempHeaders.push(dayName);
        const slots = getSlots(dayObject);
        slots.forEach(slot =>
        {
          days.push(dayObject[slot]);
        });
        fullCalendar.push(days);
      });
      updateCalendar(fullCalendar);
      setHeaders(tempHeaders);
    });


    let eventNameRef = database.ref('Events/' + eventID);
    eventNameRef.once('value', (snapshot) => {
      setEventName(snapshot.val()['eventName']);
      getStart(snapshot.val()['startTime']);
      getEnd(snapshot.val()['endTime']);
    });

    }, []);

    const getTimeLabels = (numSlots, startTime=0.0, endTime=24.0) => {
      const getTimeString = (n) => {
          return ((((Math.trunc(n) <= 12) ? Math.trunc(n) : (Math.trunc(n) % 12)) == 0) ? "12" : "" + ((Math.trunc(n) <= 12) ? Math.trunc(n) : (Math.trunc(n) % 12))) + ":" + (((Math.round((n % 1.0) * 60)) < 10) ? ("0" + (Math.round((n % 1.0) * 60))) : (Math.round((n % 1.0) * 60))) + " " + (((Math.trunc(n) >= 12) && (Math.trunc(n) > 0)) ? "PM" : "AM");
      }
        let times = [numSlots];
        for(let i = 0; i < numSlots; i++) {
          times[i] = (i == 0) ? (startTime) : times[i-1] + parseFloat((endTime - startTime) / numSlots);
      }
        return times.map(getTimeString);
    }
    const timestampArray = getTimeLabels(calendar[0].length, start, end);

  return(
    <div className="calendar">
    <div className="eventName">
      <h1>{eventName}</h1>
    </div>
      <div className="allDays">
       <div className="allTimestamps">
         <div className="headerSpacer"> {/* this is to create the correct amount of spacing */}
          </div>
        {timestampArray.map((timestamp) =>
          <div className="timestamp"> {timestamp} </div>
        )}
       </div>
      {/* <div className="allTimestamps">
      //   <div className="header">
      //
      //   </div>
      //   <div className="timestamp"> TestTimeStamp </div>
      //   <div className="timestamp"> TestTimeStamp2 </div>
      //   <div className="timestamp"> TestTimeStamp2 </div>
      //   <div className="timestamp"> TestTimeStamp2 </div>
      //   <div className="timestamp"> TestTimeStamp2 </div>
      //   <div className="timestamp"> TestTimeStamp2 </div>
      // </div>
      */}

      {(calendar.length) > 0 ?
      calendar.map((day, key) => <Day loggedInUser={userName} ids={day} eventID={eventID} header={headers[key]}>></Day>) : <div></div>
    }
      </div>
    </div>
  );
}

const getSlots = (calDictDay) =>
{
  const slotSorter = Intl.Collator(undefined, {numeric: true, sensitivity: "base"});
  let slots = []
  for(let slot in calDictDay)
  {
    slots.push(slot);
  }
  slots.sort(slotSorter.compare);
  return slots
}

const LinkInfo = () =>
{
  const URL = window.location.href;
  const handleLinkInfoClick = () =>
  {
    const urlHidden = document.getElementById("link-info-hidden-box");
    urlHidden.select();
    document.execCommand("copy");
    alert("Copied " + urlHidden.value + " to clipboard!");
  }
  //this button text can/should be updated
  return(
    <div className="link-info">
      <button onClick={handleLinkInfoClick} className="link-info-text">Share Link: {URL}</button>
      <input id="link-info-hidden-box" type="text" className="link-info-hidden-box" value={URL} readOnly></input>
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
  const handleSubmit = (value) => {
    // Ensure that user has first and last name
    if (name.indexOf(' ') == -1) {
      alert('You must have a first and last name');
    }
    else {
      toggleLogged(true);
    }
  }
  // Capitalize each word in name
  const capitalizeWords = (str) => {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

    return (
      <center>
      <br /><br />
      <div id='modal-root'>
        <div className="App">
            <div className="logoDiv">
              <img className="logo" src={logo} alt="logo" />
            </div>

            <div className="loginDiv">
              <div className="loginFormDiv">
                  {isLogged ? <p>{name} is logged in!</p> : <p>Please log in with your first and last name.</p>}
              <Form onSubmit={() => handleSubmit()}>
              <Form.Group>
                <Form.Input size='large' disabled={isLogged} onChange={(e, {value}) => setName(capitalizeWords(value))} width={8} fluid placeholder="Enter name" />
                <Button primary type='submit' disabled={isLogged}>Login</Button>
                <MyTimesButton userName={isLogged ? name : false} eventID={match.params.id} className="MyTimesObject"/>
              </Form.Group>
              </Form>

              </div>
            </div>

            <div>
              <Calendar userName={isLogged ? name : false} eventID={match.params.id} className="calendar" />
            </div>
        </div>
        <LinkInfo />
      </div>

      </center>
    )
}

export default App;
