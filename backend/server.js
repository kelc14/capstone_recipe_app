"use strict";

import app from "./app.js";
import { PORT } from "./config.js";

// const app = require("./app");
// const { PORT } = require("./config");

app.listen(PORT, function () {
  console.log(`Started on http://localhost:${PORT}`);
});
