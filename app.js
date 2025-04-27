const express = require("express");
const path = require('path');
const app = express();
require("dotenv").config();

app.use(express.static(path.join(__dirname, 'public')));  
app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views', 'pages')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const CORS = (allowedOrigins = ["http://localhost:3000"]) => {
  return (req, res, next) => {
    const origin = req.get("Origin");

    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    } else {
      res.status(403).send("Origem não permitida.");
      return;
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

    if (req.method === "OPTIONS") {
      res.status(204).send();
    } else {
      next();
    }
  };
};

app.use(CORS());

const Router = require("./core/router.js");
const router = new Router();

app.use(async (req, res) => {
  await router.run(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
