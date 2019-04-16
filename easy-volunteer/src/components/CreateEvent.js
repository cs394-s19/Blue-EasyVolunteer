import React, { useState } from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import { firebase } from '../firebaseConfig'
import '../App.css';



const EventForm = () => {

  const [firstName, updateFirstName] = useState('');
  const [lastName, updateLastName] = useState('');
  const [orgName, updateOrgName] = useState('');
  const [eventName, updateEventName] = useState('');
  const [description, updateDescription] = useState('');
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
      firstName: firstName,
      lastName: lastName,
      orgName: orgName,
      eventName: eventName,
      description: description,
      numShifts: lengthShifts
    });
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
    for (let ii = 0; ii<lengthShifts; ii++){
      let currSlot = 'slot' + ii.toString();
      dict[currSlot] = 0;
    }
    var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var ifDay = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
    for (var ii = 0; ii < daysOfWeek.length; ii++) {

      if (ifDay[ii]){
          console.log("monday");
          database.ref('Events/' + newEvent.key + '/Calendar/' + daysOfWeek[ii]).set(dict);
      }
    }
  }
  const timeOptions = [
    {
      key: '.5hr',
      text: '30 min',
      value: 48
    },
    {
      key: '1hr',
      text: '1 hour',
      value: 24
    },
    {
      key: '2hr',
      text: '2 hours',
      value: 12
    },
    {
      key: '4hr',
      text: '4 hours',
      value: 6
    },
    {
      key: '12hr',
      text: 'Half a day',
      value: 2
    },
    {
      key: '24hr',
      text: 'Full day',
      value: 1
    }
  ];

  const formStyle = {
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: '10%',
    padding: '40px'
  };
  return (
    <div className='App'>
      <div style={formStyle}>
      <Form onSubmit={() => handleSubmit()}>
        <Form.Group>
          <Form.Input onChange={(e, {value}) => updateFirstName(value)} name="firstName" width={8} fluid label='First name' placeholder='First name' />
          <Form.Input onChange={(e, {value}) => updateLastName(value)} name="lastName" width={8} fluid label='Last name' placeholder='Last name' />
        </Form.Group>
        <Form.Input onChange={(e, {value}) => updateOrgName(value)} name="orgName" width={16} fluid label="Organization Name (optional)" />
        <Form.Input onChange={(e, {value}) => updateEventName(value)} name="eventName" width={16} fluid label="Event Name" />
        <Form.TextArea onChange={(e, {value}) => updateDescription(value)} name="description" width={16} label='Event Description' placeholder='Tell us more about the event' />

          <Form.Checkbox onChange={(e, {checked}) => toggleMonday(checked)} name="monday" label="Monday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleTuesday(checked)} name="tuesday" label="Tuesday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleWednesday(checked)} name="wednesday" label="Wednesday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleThursday(checked)} name="thursday" label="Thursday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleFriday(checked)} name="friday" label="Friday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleSaturday(checked)} name="saturday" label="Saturday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleSunday(checked)} name="sunday" label="Sunday" />
      
        <Dropdown
          placeholder='Select the duration of shifts'
          fluid
          selection
          width={8}
          options={timeOptions}
          onChange={(e, {value}) => updateLength(value)}
        />
        <div className='createEventBtn'>
          <Button type='submit'>Create Event</Button>
        </div>
      </Form>
      </div>
    </div>

  )
}


export default EventForm;
