import React, { useState } from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import { DateInput, TimeInput } from 'semantic-ui-calendar-react'
import { firebase } from '../firebaseConfig'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import '../App.css';



const EventForm = () => {


  const [eventName, updateEventName] = useState('');
  const [isWeekly, weeklyToggle] = useState(true);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [days, setDays] = useState([]);


  const [monday, toggleMonday] = useState(false);
  const [tuesday, toggleTuesday] = useState(false);
  const [wednesday, toggleWednesday] = useState(false);
  const [thursday, toggleThursday] = useState(false);
  const [friday, toggleFriday] = useState(false);
  const [saturday, toggleSaturday] = useState(false);
  const [sunday, toggleSunday] = useState(false);
  const [lengthShifts, updateLength] = useState(0);

  const database = firebase.database();

  const handleSubmit = () => {

    let newEvent = database.ref('Events').push({
      eventName: eventName,
      numShifts: lengthShifts,
      startTime: convertTime(startTime),
      endTime: convertTime(endTime),
      lengthShifts: lengthShifts
    });
    if (isWeekly) {
      database.ref('Events/' + newEvent.key + '/Calendar').set({
        Monday: monday,
        Tuesday: tuesday,
        Wednesday: wednesday,
        Thursday: thursday,
        Friday: friday,
        Saturday: saturday,
        Sunday: sunday
      });
      let dict = {};
      let numSlots = Math.abs(convertTime(startTime)-convertTime(endTime)) * lengthShifts;
      for (let ii = 0; ii<numSlots; ii++){
        let currSlot = 'slot' + ii.toString();
        dict[currSlot] = 0;
      }
      var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      var ifDay = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
      for (var ii = 0; ii < daysOfWeek.length; ii++) {

        if (ifDay[ii]){
            database.ref('Events/' + newEvent.key + '/Calendar/' + daysOfWeek[ii]).set(dict);
        }
      }
    }
    else {
      let dict = {};
      let numSlots = Math.abs(convertTime(startTime)-convertTime(endTime)) * lengthShifts;
      for (let ii = 0; ii<numSlots; ii++){
        let currSlot = 'slot' + ii.toString();
        dict[currSlot] = 0;
      }
      for (let ii = 0; ii < days.length; ii++) {
        let d1 = new Date(days[ii]);
        let header = String(d1).substr(0, 15);
        database.ref('Events/' + newEvent.key + '/Calendar/' + header).set(dict);
      }
    }

    window.open(`/event/${newEvent.key}`,"_self");


  }

  const timeRangeOptions = [
    {
      key: 'weekly',
      text: 'Weekly',
      value: true
    },
    {
      key: 'dates',
      text: 'Specific Dates',
      value: false
    }
  ];

  const timeOptions = [
    {
      key: '.5hr',
      text: '30 min',
      value: 2
    },
    {
      key: '1hr',
      text: '1 hour',
      value: 1
    },
    {
      key: '2hr',
      text: '2 hours',
      value: .5
    },
    {
      key: '4hr',
      text: '4 hours',
      value: .25
    }
  ];

  const formStyle = {
    marginLeft: '2%',
    marginRight: '2%',
    marginTop: '10%',
    padding: '10px'
  };

  const updateCalendar = (day) => {
    let daysCopy = days;
    let index = days.indexOf(day)
    if (index === -1) {
      daysCopy.push(day);
      setDays(daysCopy);
    }
    else {
      daysCopy.splice(index, 1);
      setDays(daysCopy);
    }
  }

  const convertTime = (time) => {
    let hours = parseInt(time.substr(0, 2));
    let minutes = parseInt(time.substr(3, 2));
    return (hours + (minutes/60));

  }

  const marginBottomStyle = {
    marginBottom: '10px'
  }

  const calendarStyle = {
    marginBottom: '50%',
    left: "0px"
  }
  const timeStyle = {
    margin: '10px'
  }


  return (
    <div className='App'>
      <div style={formStyle}>
      <Form onSubmit={() => handleSubmit()}>


        <Form.Input onChange={(e, {value}) => updateEventName(value)} name="eventName" width={16} fluid label="Event Name" />
        <label class="bold">Days of the Week or Specific Dates?</label>
        <Dropdown
          placeholder='Weekly'
          fluid
          selection
          width={8}
          options={timeRangeOptions}
          onChange={(e, {value}) => weeklyToggle(value)}
          style={marginBottomStyle}
        />
        {
            isWeekly ?
          <div>
            <Form.Checkbox onChange={(e, {checked}) => toggleMonday(checked)} name="monday" label="Monday" />
            <Form.Checkbox onChange={(e, {checked}) => toggleTuesday(checked)} name="tuesday" label="Tuesday" />
            <Form.Checkbox onChange={(e, {checked}) => toggleWednesday(checked)} name="wednesday" label="Wednesday" />
            <Form.Checkbox onChange={(e, {checked}) => toggleThursday(checked)} name="thursday" label="Thursday" />
            <Form.Checkbox onChange={(e, {checked}) => toggleFriday(checked)} name="friday" label="Friday" />
            <Form.Checkbox onChange={(e, {checked}) => toggleSaturday(checked)} name="saturday" label="Saturday" />
            <Form.Checkbox onChange={(e, {checked}) => toggleSunday(checked)} name="sunday" label="Sunday" />
          </div>
            :
          <div>
            <DateInput
              inline
              name="startDate"
              placeholder="Dates"
              dateFormat="MM-DD-YYYY"
              marked={days}
              closable={true}
              onChange={(e, {value}) => updateCalendar(value)}
              style={calendarStyle}
              label="Pick Dates"
            />
          </div>

        }
        <Form.Group>
          <TextField
            label="Start Time"
            type="time"
            InputLabelProps={{
              shrink: true,
            }} 
            style={timeStyle}
            onChange={(e) => setStartTime(e.target.value)}
          />

          <TextField
            label="End Time"
            type="time"
            InputLabelProps={{
              shrink: true,
            }}
            style={timeStyle}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Form.Group>
        
        <label class="bold">Shift Duration</label>
        <Dropdown
          placeholder='Select the duration of shifts'
          fluid
          selection
          width={8}
          options={timeOptions}
          onChange={(e, {value}) => updateLength(value)}

        />
        <div className='createEventBtn'>
          <Button primary type='submit'>Create Event</Button>
        </div>
      </Form>
      </div>
    </div>

  )
}


export default EventForm;
