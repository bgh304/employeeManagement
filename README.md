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

## Frontend Documentation
### Authenticate.js
In ```login``` function, ```token``` and ```userid``` are set into ```localStorage```. They are response data from server side login endpoint. ```token``` data is required to use the actual app, and ```userid``` data determines which user's account is used.

![employeeManagement documentation](https://github.com/user-attachments/assets/573cb72c-0bab-4b67-b9f2-c9a0b97691ce)

### Departments.js / Employees.js / DepartmentsPage.js / EmployeesPage.js
Departments.js and Employees.js are data tables for employees and departments, which are rendered into DepartmentsPage.js and EmployeesPage.js.

'Departments' and 'Employees' table rows have two modes: showing data and updating existing data.

DepartmentsPage.js and EmployeesPage.js shows data tables, has functionality to create data and navigation to Settings.js and logout.

### Departments.js / Employees.js
```userIdProps``` props for 'Departments'' and 'Employees'' main functions: sent from DepartmentsPage/EmployeesPage component, and specifies which user's data is handled.

**UPDATING AND RE-RENDERING DATA**

Both components have same way to update and re-render data. They have same kind of props for main function, states and functions.

To switch table row into editing mode, ```updateOnOff``` state needs to be ```true``` and ```updateDepartmentIdFunction``` needs to return ```true```.

**Props**

- ```updateDepartmentsProps```/```updateEmployeesProps``` props for the main functions: sent from DepartmentsPage/EmployeesPage component when new data is added to database. Required to be ```true``` to re-render table for latest data.

**States**

- ```updateDepartments```/```updateEmployees``` state: required to be ```true``` to re-render table for latest data. The state is changed when data is deleted or updated.
- ```updateOnOff``` state: determines if single table row is to be edited. The state is changed when updating data or ```updateDepartmentOnOff```/```updateEmployeeOnOff``` function is used.
- ```updateDepartmentId```/```updateEmployeeId``` state: specifies which table row is to be edited.

**Functions**

- ```updateDepartmentOnOff```/```updateEmployeeOnOff``` function: changes table's data row into editing mode.
- ```updateDepartmentIdFunction```/```updateEmployeeIdFunction``` function: used to specify which table row is to be edited. Returns ```true``` for department/employee to be edited (based on it's ID).

### Departmentspage.js / Employeespage.js

If there isn't token set into ```localStorage``` in Authenticate.js, user is sent back to login page.

```updateDepartments```/```updateEmployees``` state: sent to 'Departments/Employees' components to re-render table. The state is changed when new data is added to database.

## Authors
Antti Salonen [@bgh304](https://github.com/bgh304)
