const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3500;

const app = express();

app.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "/new-page.html"); // 302 by default
});

// route handlers
app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted to load hello.html");
    next(); // go to the next function
}, (req, res) => {
    res.send("hello world");
});

const first = (req, res, next) => {
    console.log("first");
    next();
};

const second = (req, res, next) => {
    console.log("second");
    next();
};

const third = (req, res) => {
    console.log("third");
    res.send("finished");
};

app.get("/chain(.html)?", [first, second, third]);

// catch all at the end
app.get("/*", (req, res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));