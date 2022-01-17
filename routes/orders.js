const router = require('express').Router();
const pool = require('../database');
const { verifyAuthorization, verifyNotAdmin, verifyAdmin } = require('./verifyToken');

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
router.post('/', verifyNotAdmin, async (req, res) => {
    const foods = req.body.foods;
    if (!foods || !Array.isArray(foods) || foods.length  == 0) return res.status(400).send({ message: "Invalid request body!" });

    const date = new Date();
    if ((((date.getDay() - 1) % 7) + 7) % 7 == 6) return res.status(503).send({ message: "La domenica questo servizio non è disponibile!" });

    const foodsRows = await pool.query("SELECT * FROM foods");
    const validFoodsLength = foodsRows.length;
    
    var sql_orders = 'INSERT INTO orders (userId) VALUES (?)';
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
        const rows = await pool.query(sql_orders, req.user.userId);
        foods.forEach(food => {
            sql_order_details += ` (${rows.insertId}, ${food[0]}, ${food[1]}),`;
        });
        sql_order_details = sql_order_details.substr(0, sql_order_details.length - 1);
        await pool.query(sql_order_details);
        return res.status(201).send({ message: req.body });
    }
});

/*
    '/'                 - endpoint (method: GET)

    Endpoint per vedere tutti gli ordini
*/
router.get('/', verifyAdmin, async (req, res) => {
    const rows = await pool.query("SELECT * FROM order_details");
    return res.status(200).send(rows);
});

/*
    '/stats'            - endpoint (method: GET)
    
    Endpoint per le statistiche (ritorna il numero di acquisti
    di ogni prodotto della settimana precedente)
*/
router.get('/stats', verifyAdmin, async (req, res) => {
    var stats = [];

    const rows = await pool.query("SELECT *, (SELECT date FROM orders WHERE order_details.orderId = orders.orderId LIMIT 1) AS date FROM order_details WHERE YEAR(CURRENT_DATE)*52+WEEK(CURRENT_DATE, 1)-YEAR((SELECT date FROM orders WHERE orders.orderId = order_details.orderId LIMIT 1))*52 - WEEK((SELECT date FROM orders WHERE orders.orderId = order_details.orderId LIMIT 1), 1) = 1");
    const foods = await pool.query("SELECT * FROM foods");
    // Chart Data
    for (let i = 0; i < foods.length; i++) {
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
        stats.push([foods[i].name, [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]]);
    }
    
    for (let i = 0; i < foods.length; i++) {
        foods.forEach(food => {
            rows.forEach(order => {
                const date = new Date(order.date);
                if (order.foodId == food.foodId) {
                    for (let j = 0; j < 6; j++) {
                        if (stats[i][0] == food.name && (((date.getDay() - 1) % 6) + 6) % 6 == j) {
                            stats[i][1][j][0] = rows[rows.indexOf(order)].quantity;
                            stats[i][1][j][1] = food.price * rows[rows.indexOf(order)].quantity;
                        }
                    }
                }
            });
        });
    }

    return res.status(200).send(stats);
});

/*
    '/:userId'     - endpoint (method: GET)

    Endpoint per vedere tutti gli ordini di un utente
*/
router.get('/:userId', verifyAuthorization, async (req, res) => {
    const rows = await pool.query('SELECT * FROM orders WHERE userId=?', req.params.userId);
    return res.status(200).send(rows);
});

// Ritorna la route contenente tutti gli endpoint
module.exports = router;
