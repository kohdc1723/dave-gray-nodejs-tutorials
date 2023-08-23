const data = {
    employees: require("../models/employees.json"),
    setEmployees: function(data) { this.employees = data; }
};

const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

const createEmployee = (req, res) => {
    const { firstname, lastname } = req.body;

    const newEmployee = {
        id: data.employees?.length ? data.employees[data.employees.length - 1].id + 1 : 1,
        firstname,
        lastname
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ "message": "firstname and lastname are required" });
    }

    data.setEmployees([...data.employees, newEmployee]);

    res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
    const { id, firstname, lastname } = req.body;

    const employee = data.employees.find(emp => emp.id === parseInt(id));
    if (!employee) {
        return res.status(400).json({ "message": `employee id ${id} not found` });
    }

    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;

    const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(id));
    const unsortedEmployees = [...filteredEmployees, employee];
    const sortedEmployees = unsortedEmployees.sort((a, b) => a.id - b.id);

    data.setEmployees(sortedEmployees);

    res.status(200).json(data.employees);
};

const deleteEmployee = (req, res) => {
    const { id } = req.body;
    
    const employee = data.employees.find(emp => emp.id === parseInt(id));
    if (!employee) {
        return res.status(400).json({ "message": `employee id ${id} not found` });
    }

    const filteredEmployees = data.employees.filter(emp => emp.id !== parseInt(id));
    data.setEmployees([...filteredEmployees]);

    res.json(data.employees);
};

const getEmployeeById = (req, res) => {
    const { id } = req.params;
    
    const employee = data.employees.find(emp => emp.id === parseInt(id));
    if (!employee) {
        return res.status(400).json({ "message": `employee id ${id} not found` });
    }

    res.json(employee);
};

module.exports = {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
};