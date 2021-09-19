
const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM invoices ");
        return res.json({ companies: results.rows })
    } catch(e){
        return next(e)
    }
})


module.exports = router