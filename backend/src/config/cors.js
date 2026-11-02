const env = require("./env");

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests without an Origin header, such as Postman.
        if (!origin || env.CORS_ORIGINS.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;