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

app.get('/getCalendar/:id', (req, res) => {
  let sql = "GET lkjf from events where eventID = ?"
  connection.query(sql, [req.params.id], (error, result) => {
    if (error) res.sendStatus(500);
    else {
      res.json({calendar : result['columname']});
    }
  });
});

app.get('/getVolunteerName/:volunteerID', (req, res) => {
  let sql = "SELECT volunteerName from volunteer where volunteerID = ?;"
  console.log("sd")
  console.log(req.params.volunteerID)
  connection.query(sql, [req.params.volunteerID], (error, result) => {
    if (error) {
      console.log(error)
      res.sendStatus(500);
    }
    else {
      res.json({volunteerID : result});
    }
  });
});

// app.all('/*', (req, res) => {
//   res.sendFile('./easy-volunteer/build/index.html', { root: __dirname });
// });

app.set('port', 4200);
app.listen(4200, () => console.log(`Example app listening on port 4200!`))
