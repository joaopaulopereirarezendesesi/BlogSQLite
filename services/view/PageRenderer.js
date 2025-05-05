const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

class PageRenderer {
  static declaredCache = null;
  static declaredJsonPath = path.join(__dirname, "declared.json");

  static async init() {
    await this.loadDeclared();

    fsSync.watchFile(this.declaredJsonPath, async () => {
      console.log("[PageRenderer] detected change in declared.json, reloading...");
      await this.reloadCache();
    });
  }

  static async loadDeclared() {
    if (!this.declaredCache) {
      const data = await fs.readFile(this.declaredJsonPath, "utf8");
      this.declaredCache = JSON.parse(data);
    }
    return this.declaredCache;
  }

  static async reloadCache() {
    this.declaredCache = null;
    await this.loadDeclared();
  }

  async render(pageName, req, res) {
    try {
      const declared = await PageRenderer.loadDeclared();
  
      if (!declared[pageName]) {
        throw new Error(`Página "${pageName}" não encontrada no arquivo de declaração.`);
      }
  
      const variableMap = declared[pageName]; 
      const cookies = req.cookies || {};
      const query = req.query || {};
      const param = {};
  
      param.currentPage = pageName;
  
      for (const [key, source] of Object.entries(variableMap)) {
        if (source === "cookieOrQuery") {
          param[key] = cookies[key] ?? query[key] ?? null;
        } else if (source === "cookie") {
          param[key] = cookies[key] ?? null;
        } else if (source === "ignore") {
          continue;
        } else {
          param[key] = null;
        }
      }
  
      res.render(pageName, param);
    } catch (e) {
      console.error("PageRenderer-render", e.message);
      res.statusCode = 500;
      res.end(`Erro ao renderizar página: ${e.message}`);
    }
  }
}

module.exports = PageRenderer;
