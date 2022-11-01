const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const GenId = require("../utils/SnowFlake");
const genid = new GenId({ WorkerId: 1 });

const db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"));

db.async = {};

db.async.all = (sql, params) => {
  return new Promise((reslove, rejects) => {
    db.all(sql, params, (err, rows) => {
      reslove({ err, rows });
    });
  });
};

db.async.run = (sql, params) => {
  return new Promise((reslove, rejects) => {
    db.run(sql, params, (err, rows) => {
      reslove({ err, rows });
    });
  });
};

module.exports = { db, genid };
