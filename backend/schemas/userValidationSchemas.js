import Joi from "joi";

/**  userRegisterSchema => Schema for registering new users via auth/register endpoint
 *
 * isAdmin is not allowed
 *
 */

const userRegisterSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(64).required(),
  firstName: Joi.string().min(1).max(30).required(),
  lastName: Joi.string().min(1).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

/**  userLoginSchema => Schema for registering new users via auth/register endpoint
 *
 * isAdmin is not allowed
 *
 */

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

/**  userNewSchema => Schema for registering new users
 *            via admin POST/users endpoint
 *
 * isAdmin IS allowed
 *
 */

const userNewSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(64).required(),
  firstName: Joi.string().min(1).max(30).required(),
  lastName: Joi.string().min(1).max(30).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
  isAdmin: Joi.boolean(),
});

export { userRegisterSchema, userLoginSchema, userNewSchema };
