const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { response } = require("express");
let data;

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/public")));

///connecting to my local database and getting product data
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "newdb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    data = result;
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

///sending data to index.js
app.get("/getData", (req, res) => {
  con.query("SELECT * FROM products", function (err, result, fields) {
    if (err) throw err;
    data = result;
    res.send(data);
  });
});

///posting added products to database
app.post("/postData", (reqq, ress) => {
  console.log(reqq.body);
  let post = { Name: reqq.body.Name, Description: reqq.body.Description };
  let sql = "INSERT INTO products SET ?";
  let query = con.query(sql, post, (err, res) => console.log(res));
  ress.send("added");
});

///deleting products
app.delete("/delData", (request, response) => {
  const itemToDelete = request.body.name1;
  console.log(itemToDelete);
  const sql = `DELETE FROM products WHERE Name="${itemToDelete}"`;
  con.query(sql, (err, result) => {
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
    response.send("success");
  });
});

app.listen(3000, (req, res) => console.log("success"));
