/*
BACKEND SETUP (index.js):

At line 92 (app.use) change the session secret.
At line 104-105 (mysql.createConnection) change 'password' and 'database' to ones you're using.


SQL STATEMENTS TO CREATE DATABASE TABLES:

CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userId_UNIQUE` (`userId`)
);

CREATE TABLE `departments` (
  `departmentId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(30) NOT NULL,
  `field` varchar(30) NOT NULL,
  PRIMARY KEY (`departmentId`),
  UNIQUE KEY `departmentId_UNIQUE` (`departmentId`),
  KEY `user_idx` (`userId`),
  CONSTRAINT `userDepartment` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
);

CREATE TABLE `employees` (
  `employeeId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `jobTitle` varchar(20) NOT NULL,
  `departmentId` int DEFAULT NULL,
  `seniority` varchar(20) NOT NULL,
  `salary` int NOT NULL,
  `startingDate` date NOT NULL,
  PRIMARY KEY (`employeeId`),
  UNIQUE KEY `ID_UNIQUE` (`employeeId`),
  KEY `department_idx` (`departmentId`),
  KEY `user_idx` (`userId`),
  CONSTRAINT `department` FOREIGN KEY (`departmentId`) REFERENCES `departments` (`departmentId`),
  CONSTRAINT `userEmployee` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
);
*/


const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

  if (req.method === 'OPTIONS') {
      res.sendStatus(200);
  } else {
      next();
  }
});

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use (
  session ({
    key: 'userId',
    secret: '', // change
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
  })
);

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '', // write your password here
  database: '', // write your database's name here
});

// REGISTRATION AND LOGIN
app.post('/register', (req, res)=> {
  const username = req.body.username;
  const password = req.body.password; 

  bcrypt.hash(password,saltRound, (err, hash) => {
    if (err) {
        console.log(err)
    }

    db.execute( 
      'INSERT INTO users (username, password) VALUES (?,?)', [username, hash], (err, result)=> {
        console.log(err);
      }
    );
  })
});

const verifyJWT = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    res.send('Token required');
  } else {
    jwt.verify(token, 'jwtSecret', (err, decoded) => {
      if (err) {
          console.log(err);
          res.json({ auth: false, message: 'you are failed to authenticate'});
      } else {
          req.userId = decoded.id;
          next();
      }
    });
  }
};

app.get('/isUserAuth', verifyJWT , (req, res) => {
  res.send('Authentication succeeded')
})

app.get('/login', (req, res) => {
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
    'SELECT * FROM users WHERE username = ?;', [username], (err, result)=> {
      if (err) {
          res.send({err: err});
      } 

      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            const id = result[0].id
            const token = jwt.sign({id}, 'jwtSecret', {
              expiresIn: 300,
            })
            const userid = result[0].userId;
            req.session.user = result;
            res.json({auth: true, token: token, result: result, user: username, userid: userid});
          } else{
            res.json({auth: false, message: 'Wrong username/password'});
          }
        })
      } else {
        res.json({auth: false, message: 'no user exists'});
      }
    }
  );
});

// EMPLOYEE -AND DEPARTMENT CRUD FUNCTIONALITIES
app.post('/addemployee', (req, res) => {
  const userId = req.body.userId;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const jobTitle = req.body.jobTitle;
  const departmentId = req.body.departmentId;
  const seniority = req.body.seniority;
  const salary = req.body.salary;
  const startingDate = req.body.startingDate;
  
  db.execute('INSERT INTO employees (userId, firstName, lastName, jobTitle, departmentId, seniority, salary, startingDate) VALUES (?,?,?,?,?,?,?,?)',
    [userId, firstName, lastName, jobTitle, departmentId, seniority, salary, startingDate], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('insert employee data succeeded');
      }
    }
  )
})

app.get('/getemployees', (req, res) => {
  const userId = req.query.userId;

  db.execute('SELECT * FROM employees WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})

app.put('/updateemployee', (req, res) => {
  const userId = req.body.userid;
  const employeeId = req.body.employeeid;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const jobTitle = req.body.jobtitle;
  const departmentId = req.body.departmentid;
  const seniority = req.body.seniority;
  const salary = req.body.salary;
  const startingDate = req.body.startingdate;

  db.execute('UPDATE employees SET firstName=?, lastName=?, jobTitle=?, departmentId=?, seniority=?, salary=?, startingDate=? WHERE userId=? AND employeeId=?;',
    [firstName, lastName, jobTitle, departmentId, seniority, salary, startingDate, userId, employeeId], (err, result) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.send(result);
    }
  })
})

app.post('/deleteemployee', (req, res) => {
  const userId = req.body.userid;
  const employeeId = req.body.employeeid;

  db.execute('DELETE FROM employees WHERE userId=? AND employeeId=?', [userId, employeeId],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('employee-data deletion succeeded');
      }
    }
  )
})

app.post('/adddepartment', (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const field = req.body.field;

  db.execute('INSERT INTO departments (userId, name, field) VALUES (?,?,?)',
    [userId, name, field], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('insert department data succeeded');
      }
    }
  )
})

app.get('/getdepartments', (req, res) => {
  const userId = req.query.userId;

  db.execute('SELECT * FROM departments WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})

app.put('/updatedepartment', (req, res) => {
  const userId = req.body.userid;
  const departmentId = req.body.departmentid;
  const departmentName = req.body.departmentname;
  const departmentField = req.body.departmentfield;

  db.execute('UPDATE departments SET name=?, field=? WHERE userId=? AND departmentId=?;',
    [departmentName, departmentField, userId, departmentId], (err, result) => {
      if (err) {
        res.send(err);
        console.log(err);
      } else {
        res.send(result);
        console.log(result);
      }
    }
  )
})

app.post('/deletedepartment', (req, res) => {
  const userId = req.body.userid;
  const departmentId = req.body.departmentid;

  db.execute('DELETE FROM departments WHERE userId=? AND departmentId=?', [userId, departmentId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        console.log('department-date deletion succeeded');
        res.send(result);
      }
    }
  )
})

app.post('/deleteallemployees', (req, res) => {
  const userId = req.body.userid;

  db.execute('DELETE FROM employees WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})

app.post('/deletealldepartments', (req, res) => {
  const userId = req.body.userid;

  db.execute('DELETE FROM departments WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})

// DELETE USER ACCOUNT
app.post('/deleteaccount', (req, res) => {
  const userId = req.body.userid;

  db.execute('DELETE FROM users WHERE userId=?', [userId], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
})

app.listen(3001, () => {
  console.log('running server');
});