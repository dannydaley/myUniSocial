let mysql = require("mysql");

var db = mysql.createConnection({
    host: process.env.DATABASEHOST,
    port: process.env.DATABASEPORT,
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASSWORD,
    database: process.env.DATABASENAME,
});

db.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = db;
