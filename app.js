const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/static", express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views", "pages"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

class CorsPolicy {
  constructor(allowedOrigins = ["http://localhost:3000"]) {
    this.allowedOrigins = allowedOrigins;
    this.middleware = this.middleware.bind(this);
  }

  middleware(req, res, next) {
    const origin = req.get("Origin");

    if (!origin || this.allowedOrigins.includes(origin)) {
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

      if (req.method === "OPTIONS") {
        return res.sendStatus(204);
      }

      return next();
    }

    return res.status(403).send("Origem não permitida.");
  }
}

const cors = new CorsPolicy(["http://localhost:3000"]);
app.use(cors.middleware);

const PageRenderer = require("./services/view/PageRenderer");
PageRenderer.init().then(() => {
  const Router = require("./core/router.js");
  const router = new Router();

  app.use(async (req, res) => {
    await router.run(req, res);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
