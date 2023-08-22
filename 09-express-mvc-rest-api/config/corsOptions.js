const whitelist = [
    "http://localhost:3500",
    "https://www.anysite.com"
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("not allowed by cors"));
        }
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;