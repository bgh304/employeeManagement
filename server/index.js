const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const bcrypt = require('bcrypt');
const saltRound = 10;

const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // allow preflight
  if (req.method === 'OPTIONS') {
      res.sendStatus(200); //vanha versio: res.send(200);
  } else {
      next();
  }
});

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use (
    session ({
        key: "userId",
        secret: "subscribe", //MUUTA
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "salasana",
    database: "employeemanagement", 
});

app.post('/register', (req, res)=> {
    const username = req.body.username;
    const password = req.body.password; 

    bcrypt.hash(password,saltRound, (err, hash) => {

        if (err) {
            console.log(err)
        }
        db.execute( 
            "INSERT INTO users (username, password) VALUES (?,?)",
            [username, hash], 
            (err, result)=> {
                console.log(err);
            }
        );
    })
});

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.send("We need a token, please give it to us next time");
    } else {
        jwt.verify(token, "jwtSecret", (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({ auth: false, message: "you are failed to authenticate"});
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    }
};

app.get('/isUserAuth', verifyJWT , (req, res) => {
    res.send("You are authenticated Congrats:")
})

app.get("/login", (req, res) => {
    if (req.session.user) {
      res.send({ loggedIn: true, user: req.session.user });
    } else {
      res.send({ loggedIn: false });
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.execute(
        "SELECT * FROM users WHERE username = ?;",
        [username], 
        (err, result)=> {
            if (err) {
                res.send({err: err});
            } 

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        const id = result[0].id
                        const token = jwt.sign({id}, "jwtSecret", {
                            expiresIn: 300,
                        })
                        const userid = result[0].userId;
                        req.session.user = result; //toistepäin?

                        console.log(req.session.user);
                        res.json({auth: true, token: token, result: result, user: username, userid: userid});
                    } else{
                        res.json({auth: false, message: "Wrong username password"}); 
                        console.log("wrong username password");
                    }
                })
            } else {
                res.json({auth: false, message: "no user exists"});
            }
        }
    );
});

app.post('/addemployee', (req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const jobTitle = req.body.jobTitle;
  const departmentId = req.body.departmentId;
  const seniority = req.body.seniority;
  const salary = req.body.salary;
  const startingDate = req.body.startingDate;

  console.log("");
  console.log(userId + firstName + lastName + jobTitle + departmentId + seniority + salary + startingDate);
  console.log("");
  
  db.execute("INSERT INTO employees (userId, firstName, lastName, jobTitle, departmentId, seniority, salary, startingDate) VALUES (?,?,?,?,?,?,?,?)",
    [userId, firstName, lastName, jobTitle, departmentId, seniority, salary, startingDate], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("insert data succeeded");
      }
    }
  )
})

app.post('/deleteemployee', (req, res) => {
  const userId = req.body.userid;
  const employeeId = req.body.employeeid;

  db.execute("DELETE FROM employees WHERE userId=? AND employeeId=?", [userid, employeeid],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('data deletion succeeded');
      }
    }
  )
})

app.get('/getemployees', (req, res) => {
  const userId = req.query.userId;
  console.log("BACKEND userId on: " + userId);

  db.execute('SELECT * FROM employees WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
      //console.log(result[0].firstName);
    }
  })
})

app.put('/updateemployee', (req, res) => {
  const userId = req.body.userid;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const jobTitle = req.body.jobtitle;
  const departmentId = req.body.departmentid;
  const seniority = req.body.seniority;
  const salary = req.body.salary;
  const startingDate = req.body.startingdate;

  db.execute('UPDATE employee SET userId = ?, firstName = ?, lastName = ?, jobTitle = ?, departmentId = ?, seniority = ?, salary = ?, startingDate = ? WHERE employeeId = ? AND userId = ?',
    [userId, firstName, lastName, jobTitle, departmentId, seniority, salary, startingDate, employeeId, userId], (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
  })
})

app.get('/getdepartments', (req, res) => {
  const userId = req.query.userId;
  console.log("BACKEND (getdepartments) userId on: " + userId);

  db.execute('SELECT * FROM departments WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
      //console.log(result[0].firstName);
    }
  })
})

app.listen(3001, () => {
    console.log("running server");
});