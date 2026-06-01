//start server
require("dotenv").config();//import dotenv to read .env file
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();

app.listen(process.env.PORT,() => {
    console.log(`server started at ${process.env.PORT}`);
})

