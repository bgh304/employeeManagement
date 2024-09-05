# Simple Employee Management System
Fullstack browser application with basic CRUD-functionalities and user registration/authentication.

## Technologies used
- React
- Axios
- Node.JS
- Express
- CORS
- MySQL
- HTML/CSS

## SQL setup
Run following SQL create statements for the database:
```
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
```

## Backend setup (index.js) for local environment
In ```app.use``` change the session secret:
```
app.use (
  session ({
    key: 'userId',
    secret: '', //change
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
  })
);
```

In ```mysql.createConnection``` change 'password' and 'database' to one's you're using:
```
const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '', //write your password here
  database: '', //write your database's name here
});
```

## Front End Documentation
### Authenticate.js
In ```login``` function, ```token``` and ```userid``` are set into localStorage.

## Authors
Antti Salonen [@bgh304](https://github.com/bgh304)
