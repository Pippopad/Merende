const mariadb = require('mariadb');

var pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err == "PROTOCOL_CONNECTION_LOST") console.error("Database connection lost!");
        if (err == "ER_CON_COUNT_ERROR") console.error("Database has too many connection!");
        if (err == "ECONNREFUSED") console.error("Couldn't connect to the database!");
    }

    if (connection) connection.release();

    return;
});

module.exports = pool;
