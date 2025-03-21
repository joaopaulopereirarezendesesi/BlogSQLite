const express = require("express");
const sqlite3 = require("sqlite3");
const port = 3000;

const app = express();

const db = new sqlite3.Database("user.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)"
  );
});

app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const name = req.body.name;
  const password = req.body.password;

  if (name !== null || password !== null) {
    db.run(
      `INSERT INTO users (username, password) VALUES (${name}, ${password})`
    );
  }
});

app.listen(port, () => {
  console.log("Servidor em execução na porta 3000");
});
