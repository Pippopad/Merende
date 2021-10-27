const router = require('express').Router();
const conn = require('../connection');
const { verifyToken, verifyAuthorization, verifyNotAdmin, verifyAdmin } = require('./verifyToken');

router.post('/', verifyNotAdmin, (req, res) => {
    const foods = req.body.foods;
    if (!foods || !Array.isArray(foods) || foods.length  == 0) return res.status(400).send({ message: "Invalid request body!" });

    const date = new Date();
    if ((((date.getDay() - 1) % 7) + 7) % 7 == 6) return res.status(503).send({ message: "La domenica questo servizio non è disponibile!" });

    var validFoodsLength;

    conn.query("SELECT * FROM foods", (err, rows, fields) => {
        validFoodsLength = rows.length;
        
        var sql = "INSERT INTO orders (userOwner, classOwner, foodId) VALUES";
        var error = false;
    
        foods.forEach(food => {
            if (typeof food === 'number'    &&
                Number.isInteger(food)      &&
                food > 0                    &&
                food <= validFoodsLength) {
                    sql += ` (${req.user.userId}, '${req.user.attribute}', ${food}),`;
            } else {
                if (!error) res.status(400).send({ message: "Invalid food index!" });
                error = true;
            }
        });
    
        if (!error) {
            sql = sql.substr(0, sql.length - 1);
        
            conn.query(sql, (err, rows, fields) => {});
            return res.status(201).send({ message: req.body });
        }
    });
});

router.get('/', verifyAdmin, (req, res) => {
    conn.query("SELECT * FROM orders", (err, rows, fields) => {
        return res.status(200).send({ rows });
    });
});

/*
    '/stats'            - endpoint (method: GET)
    
    Endpoint per le statistiche (ritorna il numero di acquisti
    di ogni prodotto della settimana precedente)
*/
router.get('/stats', verifyAdmin, (req, res) => {
    var stats = [
        [],
        [],
        [],
        [],
        [],
        []
    ];

    conn.query("SELECT * from orders WHERE YEAR(CURRENT_DATE)*52+WEEK(CURRENT_DATE, 1) - YEAR(date)*52 - WEEK(date, 1) = 1", (err, rows, fields) => {
        conn.query("SELECT * FROM foods", (err2, rows2, fields2) => {
            rows2.forEach(food => {
                for (let i = 0; i < 6; i++) {
                    stats[i].push([food.name, 0]);
                }
                
                rows.forEach(order => {
                    for (let i = 0; i < 6; i++) {
                        const date = new Date(order.date);

                        // La funzione mod in javascript si scrive in un altro modo
                        // Normale: num % div = result
                        // Javascript: ((num % div) + div) % div = result
                        if (order.foodId == food.foodId &&
                            (((date.getDay() - 1) % 7) + 7) % 7 == i) {
                                for (let j = 0; j < stats[i].length; j++) {
                                    if (stats[i][j][0] == food.name) stats[i][j][1]++;
                                    break;
                                }
                            }
                    }
                });
            });
            return res.status(200).send(stats);
        });
    });
});

router.get('/:userId', verifyAuthorization, (req, res) => {
    conn.query(`SELECT * FROM orders WHERE userOwner=${req.params.userId}`, (err, rows, fields) => {
        return res.status(200).send(rows);
    });
});

// Ritorna la route contenente tutti gli endpoint
module.exports = router;
