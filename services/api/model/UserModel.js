const sqlite3 = require("sqlite3").verbose();
const path = require("path");

class UserModel {
  constructor() {
    this.dbPath = path.join(__dirname, "../../../user.db");
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error(
          "Erro ao conectar ao banco de dados SQLite:",
          err.message
        );
      } else {
        console.log("Conectado ao banco de dados SQLite.");
      }
    });
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      this.db.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, row) => {
          if (err) {
            return reject(err);
          }
          if (row) {
            resolve(row);
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  create(username, password, email) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
        [username, password, email],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve({ id: this.lastID, username, password, email });
        }
      );
    });
  }
}

module.exports = new UserModel();
