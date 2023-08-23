const express = require("express");
const employeesController = require("../../controllers/employeesController");
const verifyToken = require("../../middleware/verifyToken");

const router = express.Router();

router.route("/")
    .get(verifyToken, employeesController.getAllEmployees)
    .post(employeesController.createEmployee)
    .put(employeesController.updateEmployee)
    .delete(employeesController.deleteEmployee);

router.route("/:id")
    .get(employeesController.getEmployeeById);

module.exports = router;