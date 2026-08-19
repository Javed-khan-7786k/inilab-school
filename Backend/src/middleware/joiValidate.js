import ApiError from "../utils/ApiError.js";

/**
 * Express middleware for validating request payload using a Joi schema
 * @param {import("joi").ObjectSchema} schema Joi Schema object
 * @param {"body" | "query" | "params"} property Request property to validate (default: "body")
 */
export const joiValidate = (schema, property = "body") => {
  return (req, res, next) => {
    if (!schema) return next();

    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const extractedErrors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message.replace(/['"]/g, ""),
      }));

      return next(ApiError.badRequest("Validation failed", extractedErrors));
    }

    req[property] = value;
    return next();
  };
};

export default joiValidate;
