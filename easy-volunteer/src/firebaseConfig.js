const firebase = require('firebase');


const config = {
  apiKey: "AIzaSyCTEb2FXjt6gY7JK2vy407FOR6rSQFP5vE",
  authDomain: "easyvolunteer-7ae3b.firebaseapp.com",
  databaseURL: "https://testing-66f86.firebaseio.com/",
  storageBucket: "gs://testing-66f86.appspot.com/",
};

firebase.initializeApp(config);

export {firebase};


