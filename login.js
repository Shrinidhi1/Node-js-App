const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets", express.static("assets"));
app.use(bodyParser.urlencoded({
    extended: true
}));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "olacarbooking"
});

connection.connect(function (error) {
    if (error) throw error
    else console.log("Connected to the database successfully!")
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", encoder, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from loginDetails where user_name = ? and user_pass = ?", [username, password], function (error, results, fields) {
        if (results.length > 0) {
            res.redirect("/welcome");
        } else {
            res.send("Incorrect username/ password! Try again.");
        }
        res.end();
    })
})

app.get("/welcome", function (req, res) {
    res.sendFile(__dirname + "/welcome.html")
})

app.post("/passenger", encoder, function (req1, res1) {
    var username = req1.body.username;

    connection.query("select * from passengerlist where passenger_name = ?", [username], function (error, results, fields) {
        if (results.length > 0) {
            res1.send(results);
        }
        else {
            res1.send("No passenger found");
        }
        res1.end();
    })
})

app.post("/display", encoder, function (req2, res2) {

    connection.query("select * from passengerlist where source = 'Vidyanagar' and destination = 'Airport' ", function (error, results) {
        if (results.length > 0) {
            res2.send(results);
        }
        else {
            res2.send("No passenger found");
        }
        res2.end();
    })
})

app.post("/update", encoder, function (req1, res1) {

    connection.query("UPDATE passengerlist SET fare=fare+100 WHERE distance > 100", function (error, results) {
        if (!error)
            res1.send(results);
        else {
            res1.send("Passenger not found");
        }
        res1.end();
    })
})

app.listen(4000);