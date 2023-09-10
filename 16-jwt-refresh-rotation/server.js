require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyToken = require("./middleware/verifyToken");
const credentials = require("./middleware/credentials");
const connectDb = require("./config/dbConnect");

const PORT = process.env.PORT || 3500;

const app = express();

// connect to db
connectDb();

// middlewares
app.use(logger);
app.use(credentials); // handle options credentials check - before cors
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routers
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyToken); // all the routes after this line require jwt auth (works like a waterfall)
app.use("/employees", require("./routes/api/employees"));
app.use('/users', require('./routes/api/users'));
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

// error handler
app.use(errorHandler);

mongoose.connection.once("open", () => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});