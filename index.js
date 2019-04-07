const express = require("express");
const mysql = require("mysql");
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


const connection = mysql.createConnection({
  host: "web-dev.cnswmojifjds.us-east-2.rds.amazonaws.com",
  user: "team",
  password: "caesarsux",
  database: "CS394",
  port: 3306
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'easy-volunteer/build')));


app.post('/userSubmit', (req, res) => {
  // inserts basic info for the volunteer.
  let userInfoQuery = "INSERT INTO volunteer (volunteerName, phone, email) VALUES (?, ?, ?)";

  let userBlockQuery = "INSERT INTO block (eventID, dayIndex, timeIndex, volunteerID) VALUES (?, ?, ?, ?)";
  // gets the user id for the newly made user
  let userIDQuery = "SELECT COUNT(*) volunteer";

  // req.body.calendar is a 2D array indexed by date and time
  let calendar = req.body.calendar;

  // gets the total number of days and timeslots from the calendar
  let totalDays = calendar.length;
  let totalTimes = calendar[0].length;

  // first grabs the userID with the count query, then populates the block table
  connection.query(userIDQuery, [], (error, result) => {
    if (error) res.sendStatus(500);
    else {
      for (let ii = 0; ii<totalDays; ii++) {
        for (let jj = 0; jj<totalTimes; jj++) {
          if (calendar[ii][jj]) {
            connection.query(userBlockQuery, [req.body.eventID, ii, jj, result], (error, result2) => {
              if (error) res.sendStatus(500);
            });
          }
        }
      }
    }
  });
  connection.query(userInfoQuery, [req.body.name, req.body.phone, req.body.email], (error, result) => {
    if (error) res.sendStatus(500);
    else res.sendStatus(200);
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
      for (i = 0; i < 7; i++) {
        calendarInfo.push([]);
        for (j = 0; j < 5; j++) {
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
      res.json({volunteerName : result});
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
  res.sendFile(path.join(__dirname + 'easy-volunteer/build/index.html'));
});

const port = process.env.PORT || 4200;

app.listen(port);
console.log(`Example app listening on port 4200!`);
