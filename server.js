const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const app = express();


const connection = mysql.createConnection({
  host: "web-dev.cnswmojifjds.us-east-2.rds.amazonaws.com",
  user: "team",
  password: "caesarsux",
  database: "CS394",
  port: 3306
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'easy-volunteer/build')));
app.use(cors());




app.post('/newUser', (req, res) => {
  // inserts basic info for the volunteer.

  let userInfoQuery = "INSERT IGNORE INTO volunteer (volunteerName) VALUES (?)";

  var query = connection.query(userInfoQuery, [req.body.name], (error, result) => {
    if (error) res.sendStatus(500);
    else res.sendStatus(200);
  });
});

/*
  body: {
    eventID: int
    volunteerID: int
    dayIndex: int
    times: array[bool]
  }
*/
app.post('/updateSchedule', (req, res) => {
  console.log(req.body);
  let times = req.body.times;
  let event = req.body.eventID;
  let volunteer = req.body.volunteerID;
  let day = req.body.dayIndex;

  let fullQuery = "";
  for (let ii = 0; ii<times.length; ii++) {
    let insertUserBlock = `INSERT INTO block (eventID, dayIndex, timeIndex, volunteerID) VALUES (${event}, ${day}, ${ii}, ${volunteer});`
    let deleteUserBlock = `DELETE FROM block WHERE eventID = ${event} AND dayIndex = ${day} AND timeIndex = ${ii} AND volunteerID = ${volunteer};`
    console.log("entering loop");
    if (times[ii]) {
      fullQuery += (insertUserBlock);
    }
    else {
      fullQuery += deleteUserBlock;
    }
  }
  
  connection.query(fullQuery, [], (error, result) => {
    console.log(fullQuery);
    if (error) res.sendStatus(500);
    else res.sendStatus(200);
  });
});

// gets the volunteer ID given the name
app.get('/getVolunteerID/:name', (req, res) => {
  let sql = "SELECT volunteerID FROM volunteer WHERE volunteerName = ?";

  connection.query(sql, [req.params.name], (error, result) => {
    if (error) res.sendStatus(500);
    else {
      res.json({ volunteerID: result[0]['volunteerID'] });
    }
  });
});


// getCalendar: Returns all occupied time slots for an event
app.get('/getCalendar/:id', (req, res) => {
  // SQL Query to obtain every row related to a specific event ID
  let sql = "SELECT * FROM block WHERE eventID = ?"
  connection.query(sql, [req.params.id], (error, result) => {
    // If it fucks up, return error code 500
    if (error) res.sendStatus(500);
    else {
      // Initialize empty 2d array of 7 days x 5 hours of 0's
      // sets up the array for adding actual days/times for filled timeslots
      var calendarInfo = [];
      for (i = 0; i < 5; i++) {
        calendarInfo.push([]);
        for (j = 0; j < 1; j++) {
          calendarInfo[i].push(0);
        }

      }
      // For each eventID-related row, fill calendarInfo with the legitimately filled timeslots
      for (i = 0; i < result.length; i++) {
        calendarInfo[result[i]["dayIndex"]][result[i]["timeIndex"]] = result[i]["volunteerID"]
      }
      // Return calendarInfo
      res.json({calendar : calendarInfo});
    }
  });
});

// getVolunteerName - Gets the volunteer name from the volunteer table
app.get('/getVolunteerName/:volunteerID', (req, res) => {
  // SQL statement for getting volunteer name
  let sql = "SELECT volunteerName FROM volunteer WHERE volunteerID = ?;"
  // Query for name by volunteerID
  connection.query(sql, [req.params.volunteerID], (error, result) => {
    if (error) {
      // If it fucks up, send 500 status code
      console.log(error)
      res.sendStatus(500);
    }
    else {
      // Otherwise send over the volunteer ID
      res.json({volunteerName : result[0]['volunteerName']});
    }
  });
});
// getVolunteerPhone - copy of above code but for volunteer's phone number
app.get('/getVolunteerPhone/:volunteerID', (req, res) => {
  // SQL statement for getting volunteer name
  let sql = "SELECT phone FROM volunteer WHERE volunteerID = ?;"
  // Query for phone by volunteerID
  connection.query(sql, [req.params.volunteerID], (error, result) => {
    if (error) {
      // If it fucks up, send 500 status code
      console.log(error)
      res.sendStatus(500);
    }
    else {
      // Otherwise send over the volunteer ID
      res.json({volunteerPhone : result});
    }
  });
});

// getVolunteerEmail - copy of above code but for volunteer's email
app.get('/getVolunteerEmail/:volunteerID', (req, res) => {
  // SQL statement for getting volunteer name
  let sql = "SELECT email FROM volunteer WHERE volunteerID = ?;"
  // Query for phone by volunteerID
  connection.query(sql, [req.params.volunteerID], (error, result) => {
    if (error) {
      // If it fucks up, send 500 status code
      console.log(error)
      res.sendStatus(500);
    }
    else {
      // Otherwise send over the volunteer ID
      res.json({volunteerEmail : result});
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/easy-volunteer/build/index.html'));
});

const port = process.env.PORT || 4200;

app.listen(port);
console.log(`Example app listening on port 4200!`);
