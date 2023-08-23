const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

require("dotenv").config();

const data = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data; }
};

const handleLogout = async (req, res) => {
    // if you are developing fullstack, you should also delete access token on client side
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content    

    // find user in db using refresh token
    const refreshToken = cookies.jwt;
    const user = data.users.find(user => user.refreshToken === refreshToken);
    if (!user) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(403); // forbidden
    }

    // delete refresh token in db
    const otherUsers = data.users.filter(user => user.refreshToken !== refreshToken);
    const currentUser = { ...user, refreshToken: "" };
    data.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "models", "users.json"),
        JSON.stringify(data.users)
    );

    // clear refresh token in cookie
    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    });
    res.sendStatus(204);
};

module.exports = { handleLogout };