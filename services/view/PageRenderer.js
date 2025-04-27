class PageRenderer {
    async render(pageName, param, res) {
        try {
            res.render(pageName, { param });
        } catch (e) {
            console.error('PageRenderer-render', e.message);
            res.statusCode = 500;
            res.end('Erro ao renderizar página');
        }
    }
}

module.exports = PageRenderer;
