import React, { useState } from 'react'
import { Button, Form, Dropdown } from 'semantic-ui-react'
import { firebase } from '../firebaseConfig'



const EventForm = () => {

  const [firstName, updateFirstName] = useState('');
  const [lastName, updateLastName] = useState('');
  const [orgName, updateOrgName] = useState('');
  const [eventName, updateEventName] = useState('');
  const [description, updateDescription] = useState('');
  const [monday, toggleMonday] = useState('false');
  const [tuesday, toggleTuesday] = useState('false');
  const [wednesday, toggleWednesday] = useState('false');
  const [thursday, toggleThursday] = useState('false');
  const [friday, toggleFriday] = useState('false');
  const [saturday, toggleSaturday] = useState('false');
  const [sunday, toggleSunday] = useState('false');

  const database = firebase.database();

  

  const handleSubmit = () => {
    
    database.ref('Events/1').set({
      firstName: firstName,
      lastName: lastName,
      orgName: orgName,
      eventName: eventName,
      description: description,
    });
    database.ref('Events/1/Days').set({
      Monday: monday,
      Tuesday: tuesday,
      Wednesday: wednesday,
      Thursday: thursday,
      Friday: friday,
      Saturday: saturday,
      Sunday: sunday
    });
  
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
    marginTop: '10%'
  };
  return (
    <div style={formStyle}>
      <Form onSubmit={() => handleSubmit()}>
        <Form.Group>
          <Form.Input onChange={(e, {value}) => updateFirstName(value)} name="firstName" width={4} fluid label='First name' placeholder='First name' />
          <Form.Input onChange={(e, {value}) => updateLastName(value)} name="lastName" width={4} fluid label='Last name' placeholder='Last name' />
        </Form.Group>
        <Form.Input onChange={(e, {value}) => updateOrgName(value)} name="orgName" width={8} fluid label="Organization Name (optional)" />
        <Form.Input onChange={(e, {value}) => updateEventName(value)} name="eventName" width={8} fluid label="Event Name" />
        <Form.TextArea onChange={(e, {value}) => updateDescription(value)} name="description" width={8} label='Event Description' placeholder='Tell us more about the event' />
        <Form.Group>
          <Form.Checkbox onChange={(e, {checked}) => toggleMonday(checked)} name="monday" label="Monday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleTuesday(checked)} name="tuesday" label="Tuesday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleWednesday(checked)} name="wednesday" label="Wednesday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleThursday(checked)} name="thursday" label="Thursday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleFriday(checked)} name="friday" label="Friday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleSaturday(checked)} name="saturday" label="Saturday" />
          <Form.Checkbox onChange={(e, {checked}) => toggleSunday(checked)} name="sunday" label="Sunday" />
        </Form.Group>
        <Dropdown
          placeholder='Select the duration of shifts'
          fluid
          selection
          width={8}
          options={timeOptions}
        />
        <Button type='submit'>Create Event</Button>
      </Form>
    </div>
    
  )
}


export default EventForm;