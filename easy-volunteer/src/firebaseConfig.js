const firebase = require('firebase');


const config = {
  apiKey: "AIzaSyAmVsK0e7Qm6IEttTGYsQE4Z135oN2Kokk",
  authDomain: "easyvolunteer-7ae3b.firebaseapp.com",
  databaseURL: "https://easyvolunteer-7ae3b.firebaseio.com/",
  storageBucket: "gs://easyvolunteer-7ae3b.appspot.com/",
};

firebase.initializeApp(config);

export {firebase};


