import React, { useState, useEffect } from 'react';
import logo from './assets/logo2.svg'
import './semantic/dist/semantic.min.css';
import './App.css';

const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyDPTvJIvBsmFKMMuhssrFiLFed_Q-k2gw4",
  authDomain: "easyvolunteer-7ae3b.firebaseapp.com",
  databaseURL: "https://easyvolunteer-7ae3b.firebaseio.com/",
  storageBucket: "gs://easyvolunteer-7ae3b.appspot.com/",
};

firebase.initializeApp(config);
const database = firebase.database();

function getCalendar(eventID) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
}


const App = () => {

    return (
      <center>
      </center>
    )
}

export default App;
