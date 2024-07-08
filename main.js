const express = require("express");
const port = 8000;
const app = express();
const db = require("./config/mongoose");

const passport = require("passport");
const passportJwt = require("./config/passportJwt");
const session = require("express-session");

app.use(session({
    name: "rnw",
    secret: "RNW",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))


app.use(passport.initialize());
app.use(passport.session());


app.use(express.urlencoded());


app.use("/", require("./routes/v1/indexRoutes"));

app.listen(port, (error) => {
    if (error) {
        console.log("server not connected !");
    } else {
        console.log(`server running on port ${port}.`);
    }
})