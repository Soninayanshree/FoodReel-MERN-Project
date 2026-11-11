
/**
 * Global reusable validation middleware
 * Validates request data using the provided Zod schema.
 */

function validateRequest(schema) {
  return (req, res, next) => {
    // Validate request body, params and query
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    // Forward validation errors to global error middleware
    if (!result.success) {
      const error = new Error("Validation failed");

      error.statusCode = 400;

      error.details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(error);
    }

    // Continue if request data is valid
    next();
  };
}

module.exports = validateRequest;
