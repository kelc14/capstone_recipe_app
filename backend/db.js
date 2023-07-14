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

db.connect();

// const Pool = require("pg").Pool;
// const db = new Pool({
//   user: "kelseyguffanti",
//   host: "localhost",
//   database: getDatabaseUri(),
//   //   password: "password",
//   port: 5432,
// });

export default db;
