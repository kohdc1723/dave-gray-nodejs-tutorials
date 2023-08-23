const jwt = require("jsonwebtoken");

require("dotenv").config();

const data = {
    users: require("../models/users.json"),
    setUsers: function(data) { this.users = data; }
};

const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const user = data.users.find(user => user.refreshToken === refreshToken);
    if (!user) return res.sendStatus(403); // forbidden

    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.username !== decoded.username) return res.sendStatus(403);

        const roles = Object.values(user.roles);
        const payload = { 
            "userinfo": {
                "username": decoded.username,
                "roles": roles
            }
        };
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessTokenExpiration = { "expiresIn": "30s" };
        const accessToken = jwt.sign(payload, accessTokenSecret, accessTokenExpiration);

        res.json({ accessToken });
    });
};

module.exports = { handleRefreshToken };