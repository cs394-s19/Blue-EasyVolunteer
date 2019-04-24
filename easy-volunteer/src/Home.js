import React, { useState, useEffect } from 'react';

import { firebase } from './firebaseConfig';
import { Form, Button } from 'semantic-ui-react';
import './App.css';
import logo from './assets/logo2.svg'


const Home = () => {
    return (
      <center>
      <br /><br />
      <div className="App">
                <Header />
                <CreateEventPrompt />
      </div>
        </center>

          );
};
const Header = () => {
    return  (
      <div className="logoDiv">
        <img className="logo" src={logo} alt="logo" />
      </div>
);
};
const CreateEventPrompt = () => {
    const HandleEventClick = () =>
    {
        window.location = "/newEvent";
    }
    return (
      <div class="EventPrompt">
        <div>
              Welcome to EasyVolunteer - So easy, it's Volunteezy.
        </div>

        <div class="instructions">
              EasyVolunteer is an app that provides a quick and simple way to let volunteers sign up for shifts.
                </div>
        <div>
        To get started, click on the button below.

        </div>
            <div class="newEvent">
                <Form onSubmit={() => HandleEventClick()}>
                <Form.Group>
                  <Button primary type='submit' >Create a New Event </Button>
                </Form.Group>
                </Form>
            </div>
            </div>


          //


          );
};
export default Home;
