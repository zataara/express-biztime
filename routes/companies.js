
const { request } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../db");
const ExpressError = require("../expressError");


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query("SELECT * FROM companies ORDER BY name");
        return res.json({ companies: results.rows })
    } catch(e){
        return next(e)
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const results = await db.query("SELECT code, name, description FROM companies WHERE code = $1", [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Unable to find a company with code of ${code}`, 404)
        }
        const company = results.rows[0]
        return res.json({"company": company})
    } catch(e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description])
        return res.status(201).json({ company: results.rows[0] })
    } catch(e) {
        return next(e);
    }
})

router.put('/:code', async (req, res, next) => {
    try {
        const code = req.params.code;
        const {name, description} = req.body
        const results = await db.query('UPDATE companies SET name = $2, description = $3 WHERE code = $1 RETURNING code, name, description', [code, name, description])
        if (results.rows.length === 0) {
            throw new ExpressError(`Unable to find a company with code of ${code}`, 404)
        }
        const company = results.rows[0]
        return res.json({"company": company})
    } catch(e) {
        return next(e);
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const results = await db.query('DELETE FROM companies WHERE id= $1', [request.params.id]);
        return res.send({ status: "Company Deleted" })
    } catch(e) {
        return next(e);
    }
})





module.exports = router