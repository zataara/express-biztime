//Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { createData } = require("./test_db")
const db = require('../db');

let testInvoice;

//before each test,
beforeEach(createData);

afterEach(async () => {
    await db.query(`DELETE FROM invoices`);
})

afterAll(async () => {
    await db.end();
})


describe("GET /invoices", () => {
    
    test("Get a list of invoices", async () => {
        const res = await request(app).get('/invoices')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual( {invoices: res.rows } )
    })
})