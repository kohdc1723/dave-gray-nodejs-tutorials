const express = require("express");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");

const PORT = process.env.PORT || 3500;

const app = express();

/***** Custom Middlewares *****/
// logger middleware
app.use(logger);

/***** 3rd-party Middlewares *****/
// Cross Origin Resource Sharing (CORS) middleware
const whitelist = ["http://localhost:3500"];
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
app.use(cors(corsOptions));

/***** Built-in Middlewares *****/
// handle urlencoded data
// in other words... form data => Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());
// serve static files
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

/***** Express Router *****/
app.use("/", require("./routes/root"));
app.use("/subdir", require("./routes/subdir"));
app.use("/employees", require("./routes/api/employees"));

// catch all at the end
app.all("*", (req, res) => {
    res.status(404);

    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 not found" });
    } else {
        res.type("txt").send("404 not found");
    }
});

// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`server running on port ${PORT}`));