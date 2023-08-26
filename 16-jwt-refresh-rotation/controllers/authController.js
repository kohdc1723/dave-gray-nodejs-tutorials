const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ "message": "username and password are required" });
    }

    const user = await User.findOne({ username }).exec();
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

        const newAccessToken = jwt.sign(accessTokenPayload, accessTokenSecret, accessTokenExpiration);
        const newRefreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret, refreshTokenExpiration);

        const newRefreshTokenArray = !cookies?.jwt
            ? user.refreshToken
            : user.refreshToken.filter(rt => rt !== cookies.jwt);
        
        if (cookies?.jwt) {
            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000
            });
        }

        // saving refresh token in the db with current user
        user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await user.save();
        console.log(result);
        console.log(roles);

        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "None",
            // secure: true, // needed in production, comment out for thunder api test
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ newAccessToken });
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleLogin };