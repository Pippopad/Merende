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

// Ritorna la route contenente tutti gli endpoint
module.exports = router;
