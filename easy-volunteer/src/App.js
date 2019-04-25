import React, { useState, useEffect } from 'react';
import { firebase } from './firebaseConfig';
import { Form, Button } from 'semantic-ui-react';
import './App.css';
import logo from './assets/logo2.svg'
import ReactDOM from 'react-dom';

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

const Slot = ({occupyingUser, eventID, slotNum, slot_header, loggedInUser}) => {

  /*
    props:
      occupyingUser - the user's name that's currently occupying the timeslot. 0 if time slot is free
      eventID - the id for the event in firebase
      slotNum - the index for the slot
      header - the header for the day. used to index the day in firebase
      loggedInUser - the name of the user currently logged in the machine
  */

  const [busySetting, setBusySetting] = useState(false);
  const [slotClass, setClassName] = useState('slot-free');
  const [displayed, setDisplayed] = useState(0);

  let database = firebase.database();
  let ref = database.ref('Events/' + eventID + '/Calendar/' + slot_header + '/slot' + slotNum);
  ref.on('value', (snapshot) => {
    if (snapshot.val() !== displayed){
      if (displayed === 0){
        setDisplayed(snapshot.val());
        setBusySetting(true);
        if (snapshot.val() === loggedInUser)
          setClassName('slot-user')
        else
          setClassName('slot-others');
      }
      else {
        setDisplayed(0);
        setBusySetting(false);
        setClassName('slot-free');
      }
    }
  });

  useEffect(() => {
    if (displayed === loggedInUser)
      setClassName('slot-user');
    else if (displayed === 0)
      setClassName('slot-free');
    else
      setClassName('slot-others');
  }, [loggedInUser])


  const handleSlotClick = () => {
    let database = firebase.database();
    if (loggedInUser && !busySetting) {
      console.log("setting user");
      database.ref('Events/' + eventID + '/Calendar/' + slot_header + '/slot' + slotNum).set(loggedInUser);
      setBusySetting(true);
      setDisplayed(loggedInUser);
    }
    else if ((loggedInUser === occupyingUser)) {
      setBusySetting(false);
      database.ref('Events/' + eventID + '/Calendar/' + slot_header + '/slot' + slotNum).set(0);
      setDisplayed("");
    }
    if(!loggedInUser) {
      alert("You must log in to pick up a shift.");
    }
  }
  return(
    <div className={slotClass} onClick={() => handleSlotClick()}>
      {displayed ? displayed : ""}
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

  const slots = ids.map((item, key) => <Slot slot_header={header} eventID={eventID} slotNum={key} occupyingUser={item} loggedInUser={loggedInUser}></Slot>)
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
    ref.once('value', (snapshot) => {
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
  const timestampArray = getTimeLabels(calendar[0].length);

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



const App = ({ match }) => {
  /*
    props:
      match - used to get the eventID from the URL
  */

  const [name, setName] = useState("");
  const [isLogged, toggleLogged] = useState(false);
  const handleSubmit = () => {
    toggleLogged(true);
  };

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
                {isLogged ? <p>{name} is logged in!</p> : <p>Please log in.</p>}
            <Form onSubmit={() => handleSubmit()}>
            <Form.Group>
              <Form.Input size='large' onChange={(e, {value}) => setName(value)} width={8} fluid placeholder="Enter name" />
              <Button primary type='submit'>Login</Button>
              <MyTimesButton userName={isLogged ? name : false} eventID={match.params.id} className="MyTimesObject"/>
            </Form.Group>
            </Form>

            </div>
          </div>

          <div>
            <Calendar userName={isLogged ? name : false} eventID={match.params.id} className="calendar" />
          </div>


      </div>
      </div>
      </center>
    )
}

export default App;
