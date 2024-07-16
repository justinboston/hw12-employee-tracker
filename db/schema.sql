-- Drop the database if it exists
DROP DATABASE IF EXISTS employeetracker_db;

-- Create the database
CREATE DATABASE employeetracker_db;

-- Switch to the new database
\c employeetracker_db;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2) NOT NULL,  -- Added precision and scale for salary
    department_id INTEGER,
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE,
    manager_id INTEGER,
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL
);

