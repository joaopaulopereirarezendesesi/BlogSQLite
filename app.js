const express = require("express");
const sqlite3 = require("sqlite3");
const port = 3000;

const app = express();

app.use(express.json());

const db = new sqlite3.Database("user.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, celular TEXT, email TEXT, cpf TEXT, rg TEXT)"
  );
});

app.use("/static", express.static(__dirname + "/static"));
app.set("view engine", "ejs");

app.get("/cadastro", (req, res) => {
  res.render("cadastro");
});

app.post("/cadastro", (req, res) => {
  console.log("O QUE CHEGOU NO BODY: ", req.body);
  const { nome, senha, consenha, celular, email, cpf, rg } = req.body;

  if (!nome || !senha || !consenha || !celular || !email || !cpf || !rg) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  if (senha !== consenha) {
    return res.status(400).json({ erro: "As senhas não coincidem." });
  }

  db.run(
    `INSERT INTO users (username, password, celular, email, cpf, rg) VALUES ("${nome}", "${senha}", "${celular}", "${email}", "${cpf}", "${rg}")`
  );
});

app.listen(port, () => {
  console.log("Servidor em execução na porta 3000");
});
