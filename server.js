const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//connect db
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());
//Set Security Headers
app.use(helmet());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter = rateLimit({
  windowsMS: 10 * 60 * 1000, //10 mins
  max: 100,
});
app.use(limiter);
//Prevent hpp param pollution
app.use(hpp());

//Route Files
const auth = require("./routes/auth.js");
const restaurant = require("./routes/restaurants.js");
const ticket = require("./routes/ticket.js");
const reservation = require("./routes/reservations.js");

app.use("/api/v1/auth", auth);
app.use("/api/v1/restaurants", restaurant);
app.use("/api/v1/tickets", ticket);
app.use("/api/v1/reservations", reservation);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, "mode on port ", PORT)
);
