const express = require("express");
const mysql = require("mysql");
const app = express();


const connection = mysql.createConnection({
  host: "web-dev.cnswmojifjds.us-east-2.rds.amazonaws.com",
  user: "team",
  password: "caesarsux",
  database: "CS394",
  port: 3306
});


app.post('/userSubmit', (req, res) => {
  let userInfoQuery = "INSERT INTO volunteer (volunteerName, phone, email) VALUES (?, ?, ?)";

  connection.query(userInfoQuery, [req.body.name, req.body.phone, req.body.email], (error, result) => {
    if (error) res.sendStatus(500);
    else res.sendStatus(200);
  });
});

// getCalendar: Returns all occupied time slots for an event
app.get('/getCalendar/:id', (req, res) => {
  // SQL Query to obtain every row related to a specific event ID
  let sql = "SELECT * FROM events WHERE eventID = ?"
  connection.query(sql, [req.params.id], (error, result) => {
    // If it fucks up, return error code 500
    if (error) res.sendStatus(500);
    else {
      // Initialize empty 2d array of 31 days x 24 hours of 0's
      // sets up the array for adding actual days/times for filled timeslots
      var calendarInfo = [[]];
      for (i = 0; i < 31; i++) {
        for (j = 0; j < 24; j++) {
          calendarInfo[i].push(0)
        }
        calendarInfo.push([])
      }

      // For each eventID-related row, fill calendarInfo with the legitimately filled timeslots
      for (i = 0; i < result.length; i++) {
        calendarInfo[result[i][dayIndex]], result[i][timeIndex]] = result[i][volunteerID]
      }

      // Return calendarInfo
      res.json({calendar : calendarInfo});
    }
  });
});

// Gets the volunteer name from the volunteer table
app.get('/getVolunteerName/:volunteerID', (req, res) => {
  // SQL statement for getting volunteer name
  let sql = "SELECT volunteerName FROM volunteer WHERE volunteerID = ?;"
  // Query for volunteerID
  connection.query(sql, [req.params.volunteerID], (error, result) => {
    if (error) {
      // If it fucks up, send 500 status code
      console.log(error)
      res.sendStatus(500);
    }
    else {
      // Otherwise send over the volunteer ID
      res.json({volunteerID : result});
    }
  });
});

// app.all('/*', (req, res) => {
//   res.sendFile('./easy-volunteer/build/index.html', { root: __dirname });
// });

app.set('port', 4200);
app.listen(4200, () => console.log(`Example app listening on port 4200!`))
