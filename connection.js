const mysql = require('mysql');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

conn.connect((err) => {
    if (!err) console.log("Connected to the database!");
    else console.log("Couldn't connect to the database!");
});

module.exports = conn;
