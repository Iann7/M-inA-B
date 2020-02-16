const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mySql = require('mysql');
const claves = require('./claves');
const app = express();

claves.

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const db = mySql.createConnection({
  host: claves.host,
  user: claves.user,
  password: claves.password,
  database: claves.database
});

// DB CONNECTION
db.connect(function(err) {
  if (err) {
    throw err;
  } else {
    console.log("mySQL connected");
  }
});

// ROUTES
app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("server has started on port 3000");
});

app.get("/", function(req, res) {
  res.render("home", {
    sent: 0,
    strangerMessage:'',
    strangerTitle: ''
  });
});



app.post("/", function(req, res) {
  if (req.body.title_input === '' || req.body.body_input === '') {
    res.render('home', {
      sent: 2,
      strangerMessage: '',
      strangerTitle: ''
    });
  }


  let sql = 'INSERT INTO messages(tite,body) VALUES (?,?);';
  db.query(sql, [req.body.title_input, req.body.body_input], function(error, results, fields) {
    if (!error) {
      console.log("Message has been inserted into the DB");



      db.query('SELECT COUNT(*) AS msgCounts FROM messages;', function(error, results, fields) {

        if (error) {
          throw error;
        } else {
          let totalFields = results[0].msgCounts - 1;
          let random = Math.floor((Math.random() * (totalFields - 1)) + 1);
          console.log("total Fields " + totalFields);
          console.log("Random " + random);
           getMessage(random, res);
        }
      });

    } else {
      throw error;
    }
  });
});



function getMessage(randomNumber, res) {
  let sql = 'SELECT tite,body FROM messages WHERE _id = ?';
  console.log(randomNumber);
  db.query(sql, [randomNumber], function(error, results, fields) {

    if (!error) {
      console.log('RandomMessage has been succesful');
      console.log(results);
      res.render('home', {
        sent: 1,
        strangerMessage: results[0].body,
        strangerTitle: results[0].tite
      })
    } else {
      throw error;
    }

  });
}

// 0 HOME 1 RANDOM MESSAGE 2 ERROR
