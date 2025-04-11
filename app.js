const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class CORS {
  constructor(
    allowedOrigins = ["http://localhost:3000"],
    allowedMethods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders = ["Content-Type", "Authorization", "X-Requested-With"]
  ) {
    this.allowedOrigins = allowedOrigins;
    this.allowedMethods = allowedMethods;
    this.allowedHeaders = allowedHeaders;
  }

  configure() {
    return (req, res, next) => {
      const origin = req.get("Origin");

      if (!origin) {
        console.log("Requisição sem origin, seguindo...");
        return next();
      }

      if (this.allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
      } else {
        res.status(403).send("Origem não permitida.");
        return;
      }

      res.setHeader(
        "Access-Control-Allow-Methods",
        this.allowedMethods.join(", ")
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        this.allowedHeaders.join(", ")
      );

      if (req.method === "OPTIONS") {
        res.status(204).send();
      } else {
        next();
      }
    };
  }
}

const corsobj = new CORS();
app.use(corsobj.configure());

const routes = require("./core/router.js");
app.use("/", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
