const userModel = require("../model/UserModel");
const utils = require("../tools/utils");
const path = require("path");

class UserController {
  constructor() {
    this.model = userModel;
  }

  async index(req, res) {
    try {
      const user = null;
      res.render("login", { user });
    } catch (error) {
      console.error("Error in index action", error.message);
      utils.jsonResponse(
        res,
        { error: "Erro ao renderizar a página de login" },
        500
      );
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await this.model.login(username, password);

      if (user) {
        res.json({ success: true, message: "Login realizado com sucesso!" });
      } else {
        res.json({ success: false, message: "Credenciais inválidas!" });
      }
    } catch (error) {
      console.error("Error in login action", error.message);
      utils.jsonResponse(res, { error: "Erro ao fazer login" }, 500);
    }
  }

  async create(req, res) {
    try {
      const { username, password, email } = req.body;
      const newUser = await this.model.create(username, password, email);
      res.json({
        success: true,
        message: "Usuário criado com sucesso!",
        user: newUser,
      });
    } catch (error) {
      console.error("Error in create action", error.message);
      utils.jsonResponse(res, { error: "Erro ao criar usuário" }, 500);
    }
  }
}

module.exports = UserController;
