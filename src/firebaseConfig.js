const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyDPTvJIvBsmFKMMuhssrFiLFed_Q-k2gw4",
  authDomain: "easyvolunteer-7ae3b.firebaseapp.com",
  databaseURL: "https://easyvolunteer-7ae3b.firebaseio.com/",
  storageBucket: "gs://easyvolunteer-7ae3b.appspot.com/",
};

firebase.initializeApp(config)

export default firebase;