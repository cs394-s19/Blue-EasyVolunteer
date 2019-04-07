const express = require("express");
const mysql = require("mysql");
const app = express();


const connection = mysql.createConnection({
  host: "web-dev.cnswmojifjds.us-east-2.rds.amazonaws.com",
  user: "team",
  password: "caesarsux",
  database: "mydb",
  port: 3306
});


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
            connection.query(userBlockQuery, [res.body.eventID, ii, jj, result], (error, result2) => {
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

app.get('/getCalendar/:id', (req, res) => {
  let sql = "GET lkjf from events where eventID = ?"
  connection.query(sql, [req.param.id], (error, result) => {
    if (error) res.sendStatus(500);
    else {
      res.json({calendar : result['columname']});
    }
  });
});

app.all('/*', (req, res) => {
  res.sendFile('./easy-volunteer/build/index.html', { root: __dirname });
});

app.set('port', 4200);
app.listen(4200, () => console.log(`Example app listening on port 4200!`))



