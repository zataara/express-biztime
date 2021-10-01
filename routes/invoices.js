const { request } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM invoices ORDER BY id");
        return res.json({ invoices: results.rows })
    } catch(e){
        return next(e)
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const results = await db.query("SELECT * FROM invoices WHERE id = $1", [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Unable to find a invoice with id of ${id}`, 404)
        }
        const company = results.rows[0]
        return res.json({"company": company})
    } catch(e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt])
        return res.status(201).json({ invoice: results.rows[0] })
    } catch(e) {
        return next(e);
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { comp_code, amt, paid_date } = req.body;
        const results = await db.query('UPDATE invoices SET comp_code = $1, amt = $2, paid_date=$4 WHERE id = $3 RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt, id, paid_date])
        if (results.rows.length === 0) {
            throw new ExpressError(`Unable to find a invoice with code of ${id}`, 404)
        }
        return res.json({"invoice": results.rows[0]})
    } catch(e) {
        return next(e);
    }
})


router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { amt, paid } = req.body;
        let paidDate = null;

        const currResult = await db.query(
                `SELECT paid
                FROM invoices
                WHERE id = $1`,
                [id]);

        if (currResult.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }

        const currPaidDate = currResult.rows[0].paid_date;

        if (!currPaidDate && paid) {
            paidDate = new Date();
        } else if (!paid) {
            paidDate = null;
        } else {
            paidDate = currPaidDate;
        }

        const results = await db.query(
            `UPDATE invoices 
            SET amt = $1, paid=$2, paid_date=$3
            WHERE id = $4 
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, 
            [amt, paid, paidDate, id])
        
            return res.json({"invoice": results.rows[0]})
    } catch(e) {
        return next(e);
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        await db.query('DELETE FROM invoices WHERE id = $1', [req.params.id]);
        return res.send({ status: "Company Deleted" })
    } catch(e) {
        return next(e);
    }
})





module.exports = router