const express = require("express");
const port = 3000;

const app = express();

const info =
  'Você está na página "info" <br/> <a href="/"> VOltar para index<a/>';

app.get("/", (req, res) => {
  res.send("Olá SESI");
});

app.get("/info", (req, res) => {
  res.send(info);
});

app.listen(port, () => {
  console.log(`Servidor HTTP rodando na porta 3001`);
});
