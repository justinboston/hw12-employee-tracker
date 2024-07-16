const inquirer = require('inquirer');
const connection = require('./db/connection');

function init() {
    console.log('***********************************');
    console.log('*                                 *');
    console.log('*        EMPLOYEE MANAGER         *');
    console.log('*                                 *');
    console.log('***********************************');
    start();
}

function start() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Add a Manager',
            'Update an employee role',
            'View Employees by Manager',
            'View Employees by Department',
            'Delete Departments | Roles | Employees',
            'View the total utilized budget of a department',
            'Exit',
        ],
    }).then((answer) => {
        switch (answer.action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Add a Manager':
                addManager();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'View Employees by Manager':
                viewEmployeesByManager();
                break;
            case 'View Employees by Department':
                viewEmployeesByDepartment();
                break;
            case 'Delete Departments | Roles | Employees':
                deleteDepartmentsRolesEmployees();
                break;
            case 'View the total utilized budget of a department':
                viewTotalUtilizedBudgetOfDepartment();
                break;
            case 'Exit':
                connection.end();
                console.log('Goodbye!');
                break;
        }
    });
}

function viewAllDepartments() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function viewAllRoles() {
    const query = `
        SELECT role.title, role.id, department.name, role.salary 
        FROM role 
        LEFT JOIN department 
        ON role.department_id = department.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function viewAllEmployees() {
    const query = `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name, r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager_name
        FROM employee e
        LEFT JOIN role r ON e.role_id = r.id
        LEFT JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function addDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the new department:',
    }).then((answer) => {
        const query = 'INSERT INTO department (name) VALUES ($1)';
        connection.query(query, [answer.name], (err, res) => {
            if (err) throw err;
            console.log(`Added department ${answer.name} to the database!`);
            start();
        });
    });
}

function addRole() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the new role:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary of the new role:',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Select the department for the new role:',
                choices: res.rows.map(department => department.name),
            },
        ]).then((answers) => {
            const department = res.rows.find(department => department.name === answers.department);
            const query = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
            connection.query(query, [answers.title, answers.salary, department.id], (err, res) => {
                if (err) throw err;
                console.log(`Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`);
                start();
            });
        });
    });
}

function addEmployee() {
    connection.query('SELECT id, title FROM role', (error, rolesResults) => {
        if (error) {
            console.error(error);
            return;
        }

        const roles = rolesResults.rows.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (error, employeesResults) => {
            if (error) {
                console.error(error);
                return;
            }

            const managers = employeesResults.rows.map(({ id, name }) => ({
                name,
                value: id,
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "Enter the employee's first name:",
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "Enter the employee's last name:",
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Select the employee role:',
                    choices: roles,
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: "Select the employee's manager:",
                    choices: [
                        { name: 'None', value: null },
                        ...managers,
                    ],
                },
            ]).then((answers) => {
                const sql = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
                const values = [answers.firstName, answers.lastName, answers.roleId, answers.managerId];
                connection.query(sql, values, (error) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log('Employee added successfully');
                    start();
                });
            }).catch((error) => {
                console.error(error);
            });
        });
    });
}

function addManager() {
    const queryDepartments = 'SELECT * FROM department';
    const queryEmployees = 'SELECT * FROM employee';

    connection.query(queryDepartments, (err, resDepartments) => {
        if (err) throw err;
        connection.query(queryEmployees, (err, resEmployees) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the department:',
                    choices: resDepartments.rows.map(department => department.name),
                },
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Select the employee to add a manager to:',
                    choices: resEmployees.rows.map(employee => `${employee.first_name} ${employee.last_name}`),
                },
                {
                    type: 'list',
                    name: 'manager',
                    message: "Select the employee's manager:",
                    choices: resEmployees.rows.map(employee => `${employee.first_name} ${employee.last_name}`),
                },
            ]).then((answers) => {
                const department = resDepartments.rows.find(department => department.name === answers.department);
                const employee = resEmployees.rows.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee);
                const manager = resEmployees.rows.find(employee => `${employee.first_name} ${employee.last_name}` === answers.manager);
                const query = 'UPDATE employee SET manager_id = $1 WHERE id = $2';
                connection.query(query, [manager.id, employee.id], (err, res) => {
                    if (err) throw err;
                    console.log(`Updated employee ${employee.first_name} ${employee.last_name} with manager ${manager.first_name} ${manager.last_name}!`);
                    start();
                });
            });
        });
    });
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee whose role you want to update:',
                choices: employees.rows.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id,
                })),
            },
        ]).then(answer => {
            const employeeId = answer.employeeId;
            connection.query('SELECT * FROM role', (err, roles) => {
                if (err) throw err;
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleId',
                        message: 'Select the new role:',
                        choices: roles.rows.map(role => ({
                            name: role.title,
                            value: role.id,
                        })),
                    },
                ]).then(answer => {
                    const roleId = answer.roleId;
                    connection.query(
                        'UPDATE employee SET role_id = $1 WHERE id = $2',
                        [roleId, employeeId],
                        (err) => {
                            if (err) throw err;
                            console.log('Employee role updated successfully!');
                            start();
                        }
                    );
                });
            });
        });
    });
}

function viewEmployeesByManager() {
    const query = `
    SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, CONCAT(e.first_name, ' ', e.last_name) AS employee
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY manager, employee;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function viewEmployeesByDepartment() {
    const query = `
    SELECT d.name AS department, CONCAT(e.first_name, ' ', e.last_name) AS employee
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    ORDER BY department, employee;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

function deleteDepartmentsRolesEmployees() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'deleteChoice',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee'],
        },
    ]).then(answer => {
        switch (answer.deleteChoice) {
            case 'Department':
                deleteDepartment();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Employee':
                deleteEmployee();
                break;
        }
    });
}

function deleteDepartment() {
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Select the department you want to delete:',
                choices: res.rows.map(department => department.name),
            },
        ]).then(answer => {
            const department = res.rows.find(department => department.name === answer.department);
            const query = 'DELETE FROM department WHERE id = $1';
            connection.query(query, [department.id], (err, res) => {
                if (err) throw err;
                console.log(`Deleted department ${answer.department} from the database!`);
                start();
            });
        });
    });
}

function deleteRole() {
    const query = 'SELECT * FROM role';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Select the role you want to delete:',
                choices: res.rows.map(role => role.title),
            },
        ]).then(answer => {
            const role = res.rows.find(role => role.title === answer.role);
            const query = 'DELETE FROM role WHERE id = $1';
            connection.query(query, [role.id], (err, res) => {
                if (err) throw err;
                console.log(`Deleted role ${answer.role} from the database!`);
                start();
            });
        });
    });
}

function deleteEmployee() {
    const query = 'SELECT * FROM employee';
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Select the employee you want to delete:',
                choices: res.rows.map(employee => `${employee.first_name} ${employee.last_name}`),
            },
        ]).then(answer => {
            const employee = res.rows.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee);
            const query = 'DELETE FROM employee WHERE id = $1';
            connection.query(query, [employee.id], (err, res) => {
                if (err) throw err;
                console.log(`Deleted employee ${answer.employee} from the database!`);
                start();
            });
        });
    });
}

function viewTotalUtilizedBudgetOfDepartment() {
    const query = `
    SELECT d.name AS department, SUM(r.salary) AS utilized_budget
    FROM employee e
    LEFT JOIN role r ON e.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    GROUP BY d.name;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        start();
    });
}

init();

