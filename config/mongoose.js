const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/admin_final_project");

const db = mongoose.connection.once("open", (error) => {
    if (error) {
        console.log("db not connected");
    } else {
        console.log("db connected :)");
    }
})

module.exports = db;