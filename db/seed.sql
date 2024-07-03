-- Connect to the database
\c employees

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Jane', 'Smith', 1, NULL),
    ('Justin', 'Boston', 2, 1),
    ('Amy', 'Chan', 3, NULL),
    ('Kevin', 'Undertaker', 4, 3),
    ('Jeremy', 'Brown', 5, NULL),
    ('Tiger', 'Woods', 6, 5),
    ('Lebron', 'James', 7, NULL),
    ('Alex', 'Rodriguez', 8, 7);
