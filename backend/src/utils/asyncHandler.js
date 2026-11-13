// This utility handles errors from asynchronous Express route handlers and middleware.
// It wraps an async function, catches any rejected promises or thrown errors,
// and forwards them to the next middleware(error.middleware) for centralized error handling.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch(next);
    };
};

module.exports = asyncHandler;
