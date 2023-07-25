// "use strict";
// /** Database setup for whisk. */
// // const { Client } = require("pg");
// // import { getDatabaseUri } from "./config.js";

// import pkg from "pg";
// const { Client } = pkg;

// const db = new Client(process.env.DATABASE_URL);

// db.connect(function (err) {
//   if (err) {
//     return console.error("could not connect to postgres", err);
//   }
//   db.query('SELECT NOW() AS "theTime"', function (err, result) {
//     if (err) {
//       return console.error("error running query", err);
//     }
//     console.log(result.rows[0].theTime);
//     // >> output: 2018-08-23T14:02:57.117Z
//   });
// });

// // const Pool = require("pg").Pool;
// // const db = new Pool({
// //   user: "kelseyguffanti",
// //   host: "localhost",
// //   database: getDatabaseUri(),
// //   //   password: "password",
// //   port: 5432,
// // });

// export default db;

// FOR RUNNING TESTS:
"use strict";
/** Database setup for whisk. */
// const { Client } = require("pg");
import { getDatabaseUri } from "./config.js";

import pkg from "pg";
const { Client } = pkg;

const db = new Client({
  host: "localhost",
  port: 5432,
  database: getDatabaseUri(),
  user: "kelseyguffanti",
});

db.connect(function (err) {
  if (err) {
    return console.error("could not connect to postgres", err);
  }
  db.query('SELECT NOW() AS "theTime"', function (err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
  });
});

// const Pool = require("pg").Pool;
// const db = new Pool({
//   user: "kelseyguffanti",
//   host: "localhost",
//   database: getDatabaseUri(),
//   //   password: "password",
//   port: 5432,
// });

export default db;
