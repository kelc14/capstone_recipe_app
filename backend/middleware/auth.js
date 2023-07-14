"use strict";

/** Convenience middleware to handle common auth cases in routes. */

import pkg from "jsonwebtoken";
const { sign, decode, verify } = pkg;
import { SECRET_KEY } from "../config.js";
import { UnauthorizedError } from "../expressError.js";

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;

    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when the logged in user must be an admin
 *
 * If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
  try {
    if (!res.locals.user || !res.locals.user.isAdmin)
      throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when the logged in user must be an either admin or the user from designated route
 * (ex. gathering their own user data)
 *
 * If not, raises Unauthorized.
 */

function ensureSelfOrAdmin(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    if (res.locals.user.username === req.params.username) {
      return next();
    }
    if (res.locals.user.isAdmin) {
      return next();
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    return next(err);
  }
}

export { authenticateJWT, ensureLoggedIn, ensureAdmin, ensureSelfOrAdmin };
