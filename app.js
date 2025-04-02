const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());

const cadastroRoutes = require("./routes/rotaCadastro");
const authRoutes = require("./routes/authRoutes");
const recoveryPasswordRoutes = require("./routes/recoverPasswordRoutes");
const fiapRoutes = require("./routes/fiapRoutes");

app.use("/", authRoutes);
app.use("/recoverPasswordRoutes", recoveryPasswordRoutes);
app.use("/cadastro", cadastroRoutes);
app.use("/login", fiapRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Node.js!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
