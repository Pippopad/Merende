const router = require('express').Router();
const conn = require('../connection');
const { verifyToken, verifyAuthorization, verifyNotAdmin, verifyAdmin } = require('./verifyToken');

router.post('/', verifyNotAdmin, (req, res) => {
    const foods = req.body.foods;
    if (!foods || !Array.isArray(foods) || foods.length  == 0) return res.status(400).send({ message: "Invalid request body!" });

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

router.get('/stats', verifyAdmin, (req, res) => {
    var stats = {
        1: {},
        2: {},
        3: {},
        4: {},
        5: {},
        6: {},
        7: {}
    };

    conn.query("SELECT * FROM orders", (err, rows, fields) => {
        conn.query("SELECT * FROM foods", (err2, rows2, fields2) => {
            rows2.forEach(food => {
                for (let i = 1; i <= 7; i++) {
                    stats[i][food.name] = 0;
                }
                
                rows.forEach(order => {
                    for (let i = 1; i <= 7; i++) {
                        var options = { 'weekday': 'long' };
                        const date = new Date(order.date)
                        if (order.foodId == food.foodId &&
                            (date.getDay() - 1) % 7 == i - 1) stats[i][food.name]++;
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
