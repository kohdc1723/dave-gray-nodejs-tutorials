const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const data = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data; }
};

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "message": "username and password are required" });
    }

    // check for duplicate username
    const duplicate = data.users.find(user => user.username === username);
    if (duplicate) return res.sendStatus(409); // conflict

    try {
        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // store the user
        const newUser = {
            username,
            password: hashedPassword
        };
        data.setUsers([...data.users, newUser]);


        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(data.users)
        );
        console.log(data.users);
        res.status(201).json({ "success": `new user ${username} created` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
};

module.exports = { handleNewUser };