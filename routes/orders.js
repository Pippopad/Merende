const router = require('express').Router();
const conn = require('../connection');
const { verifyToken, verifyAuthorization, verifyNotAdmin, verifyAdmin } = require('./verifyToken');

/*
    '/'                 - endpoint (method: POST)

    Endpoint per aggiungere un ordine

    Il corpo della richiesta deve comprendere:
        - foods         | La lista di cibi da ordinare
    
    Esempio:
    {
        "foods": [
            [foodId, amount]
        ]
    }
*/
router.post('/', verifyNotAdmin, (req, res) => {
    const foods = req.body.foods;
    if (!foods || !Array.isArray(foods) || foods.length  == 0) return res.status(400).send({ message: "Invalid request body!" });

    const date = new Date();
    if ((((date.getDay() - 1) % 7) + 7) % 7 == 6) return res.status(503).send({ message: "La domenica questo servizio non è disponibile!" });

    var validFoodsLength;

    conn.query("SELECT * FROM foods", (err, rows, fields) => {
        validFoodsLength = rows.length;
        
        var sql_orders = `INSERT INTO orders (userId) VALUES (${req.user.userId})`;
        var sql_order_details = "INSERT INTO order_details (orderId, foodId, quantity) VALUES";
        var error = false;
    
        foods.forEach(food => {
            if (typeof food[0] === 'number'    &&
                Number.isInteger(food[0])      &&
                food[0] > 0                    &&
                food[0] <= validFoodsLength) {
            } else {
                if (!error) res.status(400).send({ message: "Invalid food index!" });
                error = true;
            }
        });
    
        if (!error) {
            conn.query(sql_orders, (err2, rows2, fields2) => {
                foods.forEach(food => {
                    sql_order_details += ` (${rows2.insertId}, ${food[0]}, ${food[1]}),`;
                });
                sql_order_details = sql_order_details.substr(0, sql_order_details.length - 1);
                conn.query(sql_order_details);
            });
            return res.status(201).send({ message: req.body });
        }
    });
});

/*
    '/'                 - endpoint (method: GET)

    Endpoint per vedere tutti gli ordini
*/
router.get('/', verifyAdmin, (req, res) => {
    conn.query("SELECT * FROM order_details", (err, rows, fields) => {
        return res.status(200).send({ rows });
    });
});

/*
    '/stats'            - endpoint (method: GET)
    
    Endpoint per le statistiche (ritorna il numero di acquisti
    di ogni prodotto della settimana precedente)
*/
router.get('/stats', verifyAdmin, (req, res) => {
    var stats = [];

    conn.query("SELECT *, (SELECT date FROM orders WHERE order_details.orderId = orders.orderId LIMIT 1) AS date FROM order_details WHERE YEAR(CURRENT_DATE)*52+WEEK(CURRENT_DATE, 1) - YEAR((SELECT date FROM orders WHERE orders.orderId = order_details.orderId LIMIT 1))*52 - WEEK((SELECT date FROM orders WHERE orders.orderId = order_details.orderId LIMIT 1), 1) = 1; SELECT * FROM foods", (err, rows, fields) => {
        // Chart Data
        {
            // rows[0] = orders
            // rows[1] = list of all food
            for (let i = 0; i < rows[1].length; i++) {
                /*
                Per tutti i cibi dentro al tabella cibi (nel database)

                [
                    "Food Name",
                    [
                        [amount, price],    <- Lunedì
                        [amount, price],    <- Martedì
                        [amount, price],    <- Mercoledì
                        [amount, price],    <- Giovedì
                        [amount, price],    <- Venerdiì
                        [amount, price]     <- Sabato
                    ]
                ]
                */
                stats.push([rows[1][i].name, [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]);
            }
            
            for (let i = 0; i < rows[1].length; i++) {
                rows[1].forEach(food => {
                    rows[0].forEach(order => {
                        const date = new Date(order.date);
                        if (order.foodId == food.foodId) {
                            for (let j = 0; j < 6; j++) {
                                if (stats[i][0] == food.name && (((date.getDay() - 1) % 6) + 6) % 6 == j) {
                                    stats[i][1][j][0] = rows[0][rows[0].indexOf(order)].quantity;
                                    stats[i][1][j][1] = food.price * rows[0][rows[0].indexOf(order)].quantity;
                                }
                            }
                        }
                    });
                });
            }
        }

        return res.status(200).send(stats);
    });
});

/*
    '/user/:userId'     - endpoint (method: GET)

    Endpoint per vedere tutti gli ordini di un utente
*/
router.get('/user/:userId', verifyAuthorization, (req, res) => {
    conn.query(`SELECT * FROM orders WHERE userOwner='${req.params.userId}'`, (err, rows, fields) => {
        return res.status(200).send(rows);
    });
});

/*
    '/class/:class'             - endpoint (method: GET)

    Endpoint per vedere tutti gli ordini di un classe (accessibile solo da un amministratore)
*/
router.get('/class/:class', verifyAdmin, (req, res) => {
    conn.query(`SELECT * FROM orders WHERE classOwner='${req.params.class}'`, (err, rows, fields) => {
        return res.status(200).send(rows);
    });
});

/*
    '/class/user/:userId'       - endpoint (method: GET)

    Endpoint per vedere tutti gli ordini della classe dell'utente dato come parametro (accessibile dagli utenti della classe)
*/
router.get('/class/user/:userId', verifyAuthorization, (req, res) => {
    conn.query(`SELECT * FROM users WHERE userId=${req.params.userId}`, (err, rows, fields) => {
        conn.query(`SELECT * FROM orders WHERE classOwner='${rows[0].attribute}'`, (err2, rows2, fields2) => {
            return res.status(200).send(rows2);
        });
    });
});

// Ritorna la route contenente tutti gli endpoint
module.exports = router;
