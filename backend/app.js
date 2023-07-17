"use strict";

/** Express app for whisk. */

import express from "express";
import cors from "cors";
import { NotFoundError } from "./expressError.js";

import { router as authenticationRoutes } from "./routes/authentication.js";
import { router as userRoutes } from "./routes/users.js";
import { router as bookRoutes } from "./routes/books.js";
import { router as recipeRoutes } from "./routes/recipes.js";
import { authenticateJWT } from "./middleware/auth.js";
import morgan from "morgan";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authenticationRoutes);
app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/recipe", recipeRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

// module.exports = app;

export default app;
