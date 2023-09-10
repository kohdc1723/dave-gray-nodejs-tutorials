const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    // get refresh token from cookie and remove the token immediately
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    // try finding user using refresh token
    const user = await User.findOne({ refreshToken }).exec();
    // no user found => refresh token reuse detected
    if (!user) {
        // try verifying the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            // invalid refresh token
            if (err) return res.sendStatus(403);
            
            // valid refresh token => reuse detected
            console.log('attempted refresh token reuse');
            const hackedUser = await User.findOne({ username: decoded.username }).exec();
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
            console.log(result);
        });

        return res.sendStatus(403); // forbidden
    }

    // user found using refresh token => remove and re-issue new refresh token
    const newRefreshTokenArray = user.refreshToken.filter(rt => rt !== refreshToken);
    // evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            console.log('expired refresh token');
            user.refreshToken = [...newRefreshTokenArray];
            const result = await user.save();
            console.log(result);
        }

        if (err || user.username !== decoded.username) {
            return res.sendStatus(403);
        }

        // refresh token is still valid
        const roles = Object.values(user.roles);
        const accessTokenPayload = { 
            "userinfo": {
                "username": decoded.username,
                "roles": roles
            }
        };
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessTokenExpiration = { "expiresIn": "10s" };
        const refreshTokenPayload = { "username": user.username };
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const refreshTokenExpiration = { "expiresIn": "15s" };

        const accessToken = jwt.sign(accessTokenPayload, accessTokenSecret, accessTokenExpiration);
        const newRefreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret, refreshTokenExpiration);

        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await user.save();

        // creates secure cookie with refresh token
        res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken });
    });
};

module.exports = { handleRefreshToken };