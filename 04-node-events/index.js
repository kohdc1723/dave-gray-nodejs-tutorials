const logEvents = require("./logEvents");
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {};

// initialize the object
const myEmitter = new MyEmitter();
// add listener
myEmitter.on("log", message => logEvents(message));
setTimeout(() => {
    myEmitter.emit("log", "Log event emitted!");
}, 2000);