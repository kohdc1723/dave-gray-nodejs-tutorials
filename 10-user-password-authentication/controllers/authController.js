const bcrypt = require("bcrypt");

const data = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data; }
};

const handleLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "message": "username and password are required" });
    }

    const user = data.users.find(user => user.username === username);
    if (!user) return res.sendStatus(401); // unauthorized

    // evaluate password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
        // if use jwt token, create jwt here
        res.json({ "success": `user ${user.username} is logged in` });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };