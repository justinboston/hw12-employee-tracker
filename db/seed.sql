-- Insert into department table
INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Marketing'),
    ('Product'),
    ('Leadership');

-- Insert into role table
INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4),
    ('Marketing Specialist', 110000, 5),  
    ('Product Manager', 130000, 6),  
    ('Leadership Coach', 140000, 7);  

-- Insert into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Caitlin', 'Clark', 1, NULL),
    ('Justin', 'Boston', 2, 1),
    ('Mia', 'Hamm', 3, NULL),
    ('Kevin', 'Undertaker', 4, 3),
    ('Anthony', 'Brown', 5, NULL),
    ('Tiger', 'Woods', 6, 5),
    ('Lebron', 'James', 7, NULL),
    ('Alex', 'Rodriguez', 8, 7);

