const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const user = await User.findOne({ refreshToken }).exec();
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
        // const accessTokenExpiration = { "expiresIn": "30s" };
        const accessTokenExpiration = { "expiresIn": "10s" };
        const accessToken = jwt.sign(payload, accessTokenSecret, accessTokenExpiration);

        res.json({ roles, accessToken });
    });
};

module.exports = { handleRefreshToken };