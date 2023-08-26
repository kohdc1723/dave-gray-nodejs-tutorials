const Employee = require("../models/Employee");

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) res.status(204).json({ "message": "no employees found" });
    else res.json(employees);
};

const createEmployee = async (req, res) => {
    const { firstname, lastname } = req.body;
    if (!firstname || !lastname) {
        return res.status(400).json({ "message": "firstname and lastname are required" });
    }

    try {
        const result = await Employee.create({ firstname, lastname });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
};

const updateEmployee = async (req, res) => {
    const { id, firstname, lastname } = req.body;
    if (!id) {
        return res.status(400).json({ "message": "id is required" });
    }

    const employee = await Employee.findOne({ _id: id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `no employee matches id ${id}` });
    }

    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;
    const result = await employee.save();

    res.json(result);
};

const deleteEmployee = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ "message": "employee id is required" });
    }
    
    const employee = await Employee.findOne({ _id: id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `no employee matches id ${id}` });
    }

    const result = await employee.deleteOne({ _id: id });

    res.json(result);
};

const getEmployeeById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ "message": "employee id is required" });
    }
    
    const employee = await Employee.findOne({ _id: id }).exec();
    if (!employee) {
        return res.status(204).json({ "message": `no employee matches id ${id}` });
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