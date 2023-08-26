const User = require("../models/User");

const handleLogout = async (req, res) => {
    // if you are developing fullstack, you should also delete access token on client side
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // no content    

    // find user in db using refresh token
    const refreshToken = cookies.jwt;
    const user = await User.findOne({ refreshToken }).exec();
    if (!user) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.sendStatus(204);
    }

    // remove refresh token in db
    user.refreshToken = user.refreshToken.filter(rt => rt !== refreshToken);
    const result = await user.save();
    console.log(result);

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