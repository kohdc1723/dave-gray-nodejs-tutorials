/**
 * ### How Node.js differs from VanillaJS ###
 * 1) Node.js runs on a server, not in a browser. (It's a backend, not frontend)
 * 2) The console is the terminal window
 * 3) Global object instead of window object
 * 4) Has common core modules that we will explore
 * 5) CommonJS modules instead of ES6 modules
 * 6) Missing some JS APIs like fetch
 **/
const os = require("os");
const path = require("path");
const { add, subtract, multiply, divide } = require("./math");

console.log(os.type()); // Darwin
console.log(os.version()); // Darwin Kernel Version 22.5.0: Thu Jun  8 22:22:19 PDT 2023; root:xnu-8796.121.3~7/RELEASE_ARM64_T8103
console.log(os.homedir()); // /Users/chan

console.log(__dirname); // /Users/chan/Desktop/Workspace/dave-gray-nodejs-tutorials/01-intro
console.log(__filename); // /Users/chan/Desktop/Workspace/dave-gray-nodejs-tutorials/01-intro/server.js
console.log(path.dirname(__filename)); // /Users/chan/Desktop/Workspace/dave-gray-nodejs-tutorials/01-intro
console.log(path.basename(__filename)); // server.js
console.log(path.extname(__filename)); // .js
console.log(path.parse(__filename));
// {
//     root: '/',
//     dir: '/Users/chan/Desktop/Workspace/dave-gray-nodejs-tutorials/01-intro',
//     base: 'server.js',
//     ext: '.js',
//     name: 'server'
// }
console.log(add(2, 3)); // 5
console.log(subtract(2, 3)); // -1
console.log(multiply(2, 3)); // 6
console.log(divide(2, 3)); // 0.6666666666666666