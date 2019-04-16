import React, { useState, useEffect } from 'react';

import { firebase } from './firebaseConfig';
import { Form, Button } from 'semantic-ui-react';
import './App.css';


const Home = () => {
    return (<div class="wrapper">
                <Header />
                <CreateEventPrompt />
            </div>);
};
const Header = () => {
    return  <div className="logo"><h1>EasyVolunteer</h1></div>
};
const CreateEventPrompt = () => {
    const HandleEventClick = () => 
    {
        window.location = "/newEvent";
    }
    return (<div class="EventPrompt">
                <div id="Create-Event" onClick={() => HandleEventClick()}>
                Create A New Event
                </div>
            </div>);
};
export default Home;