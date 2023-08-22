const express = require("express");
const empData = require("../../data/employees.json");

const router = express.Router();

router.route("/")
    .get((req, res) => {
        res.json(empData);
    })
    .post((req, res) => {
        const { firstname, lastname } = req.body;
        res.json({ firstname, lastname });
    })
    .put((req, res) => {
        const { firstname, lastname } = req.body;
        res.json({ firstname, lastname });
    })
    .delete((req, res) => {
        const { id } = req.body;
        res.json({ id });
    });

router.route("/:id")
    .get((req, res) => {
        const { id } = req.params;
        res.json({ id });
    });

module.exports = router;