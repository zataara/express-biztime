/** Database setup for BizTime. */

const { Client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
    console.log('testing')
    DB_URI = "postresql:///biztime_test";
} else {
    console.log('not testing')
    DB_URI = "postgresql:///biztime"
}

let db = new Client({
    connectionsString: DB_URI
});

db.connect();

module.exports = db;
