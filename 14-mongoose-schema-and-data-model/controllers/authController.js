const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

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
        const roles = Object.values(user.roles);
        // if use jwt token, create jwt here
        const accessTokenPayload = {
            "userinfo": {
                "username": user.username,
                "roles": roles
            }
        };
        const refreshTokenPayload = { "username": user.username };
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessTokenExpiration = { expiresIn: "30s" };
        const refreshTokenExpiration = { expiresIn: "1d" };

        const accessToken = jwt.sign(accessTokenPayload, accessTokenSecret, accessTokenExpiration);
        const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret, refreshTokenExpiration);

        // saving refresh token in the db with current user
        const otherUsers = data.users.filter(user => user.username !== username);
        const currentUser = { ...user, refreshToken };
        data.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "models", "users.json"),
            JSON.stringify(data.users)
        );

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };