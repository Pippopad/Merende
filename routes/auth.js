const router = require('express').Router();
const conn = require('../connection');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

/*
    '/login'            - endpoint (method: POST)
    
    Endpoint per il login

    Il corpo della richiesta deve comprendere:
        - username      | Un username valido
        - password      | La password del rispettivo username
*/
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Verifica che nella request siano presenti username e password
    if (!username) return res.status(400).send({ message: "Username required!" });
    if (!password) return res.status(400).send({ message: "Password required!" });

    conn.query(`SELECT * FROM users WHERE username='${username}'`, (err, rows, fields) => {
        if (err) {
            console.log(err);
            return res.status(500).send({});
        }

        if (rows.length === 0) return res.status(401).send({ message: "Invalid credentials!" });

        // Verifica che la password inserita sia uguale a quella registrata
        if (password != CryptoJS.AES.decrypt(rows[0].password, process.env.AUTH_KEY).toString(CryptoJS.enc.Utf8)) {
            return res.status(401).send({ message: "Invalid credentials!" });
        }

        const token = jwt.sign({ userId: rows[0].userId, attribute: rows[0].attribute }, process.env.JWT_KEY, { expiresIn: "10m" });

        // Login effettuato con successo
        return res.status(200).send({ token });
    });

});

/*
    '/encrypt'          - endpoint (method: POST)

    Endpoint per criptare una password (solo per la fase di test)

    Il corpo della richiesta deve comprendere:
        - password      | La password che si vuole criptare
*/
router.post('/encrypt', (req, res) => {
    if (!req.body.password) return res.status(400).send({ message: "Missing password to encrypt!" });
    return res.status(200).send({ password: CryptoJS.AES.encrypt(req.body.password, process.env.AUTH_KEY).toString() });
});

// Ritorna la route contenente tutti gli endpoint
module.exports = router;
