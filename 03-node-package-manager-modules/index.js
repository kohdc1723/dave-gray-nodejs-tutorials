const { format } = require("date-fns");
const { v4: uuid } = require("uuid"); // import v4 as uuid

console.log(format(new Date(), "yyyyMMdd\tHH:mm:ss"));

console.log(uuid());