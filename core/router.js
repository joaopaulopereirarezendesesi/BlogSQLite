const { parse } = require('url');
const path = require('path');
const utils = require('../tools/utils');
const PageRenderer = require('../services/view/PageRenderer');

class Router {
    constructor() {
        this.defaultController = 'User';
        this.defaultAction = 'index';
    }

    async run(req, res) {
        try {
            const url = this.parseUrl(req);

            const routeType = url.routeType; 
            const controllerOrPage = url.controllerOrPage;
            const action = url.action;
            const param = url.param;

            if (routeType === 'api') {
                await this.handleApiRequest(controllerOrPage, action, param, res);
            } else if (routeType === 'page') {
                await this.handlePageRequest(controllerOrPage, param, res);
            } else {
                return utils.jsonResponse(res, { error: 'Rota inválida' }, 404);
            }
        } catch (e) {
            console.error('coreErrorRouter-run', e.message);
            utils.jsonResponse(res, { error: 'Internal server error' }, 500);
        }
    }

    parseUrl(req) {
        try {
            const parsedUrl = parse(req.url, true);
            const urlParts = parsedUrl.pathname.replace(/^\/|\/$/g, '').split('/');

            return {
                routeType: urlParts[0] || null,        
                controllerOrPage: urlParts[1] || this.defaultController,
                action: urlParts[2] || this.defaultAction,
                param: urlParts[3] || null,
            };
        } catch (e) {
            console.error('coreErrorRouter-parseUrl', e.message);
            utils.jsonResponse(res, { error: `Erro ao executar ação: ${e.message}` }, 500);
        }
    }

    sanitizeControllerName(name) {
        try {
            return (name.charAt(0).toUpperCase() + name.slice(1)).replace(/[^a-zA-Z0-9]/g, '') + 'Controller';
        } catch (e) {
            console.error('coreErrorRouter-sanitizeControllerName', e.message);
            utils.jsonResponse(res, { error: `Erro ao executar ação: ${e.message}` }, 500);
        }
    }

    sanitizeActionName(name) {
        try {
            return name.replace(/[^a-zA-Z0-9_]/g, '');
        } catch (e) {
            console.error('coreErrorRouter-sanitizeActionName', e.message);
            utils.jsonResponse(res, { error: `Erro ao executar ação: ${e.message}` }, 500);
        }
    }

    isValidAction(controller, action) {
        try {
            const method = controller[action];
            return typeof method === 'function';
        } catch (e) {
            console.error('coreErrorRouter-isValidAction', e.message);
            return false;
        }
    }

    async handleApiRequest(controllerName, action, param, res) {
        try {
            const controllerPath = path.join(__dirname, '..', 'controllers', this.sanitizeControllerName(controllerName) + '.js');
            let ControllerClass;

            try {
                ControllerClass = require(controllerPath);
            } catch (err) {
                return utils.jsonResponse(res, { error: `Controlador inválido: ${controllerName}` }, 404);
            }

            const controller = new ControllerClass();

            if (this.isValidAction(controller, this.sanitizeActionName(action))) {
                await this.callAction(controller, this.sanitizeActionName(action), param, res);
            } else {
                return utils.jsonResponse(res, { error: `Método inválido: ${action} em ${controllerName}` }, 404);
            }
        } catch (e) {
            console.error('coreErrorRouter-handleApiRequest', e.message);
            utils.jsonResponse(res, { error: 'Internal server error' }, 500);
        }
    }

    async handlePageRequest(pageName, param, res) {
        try {
            const pageRenderer = new PageRenderer();
            await pageRenderer.render(pageName, param, res);
        } catch (e) {
            console.error('coreErrorRouter-handlePageRequest', e.message);
            utils.jsonResponse(res, { error: 'Internal server error' }, 500);
        }
    }

    async callAction(controller, action, param, res) {
        try {
            if (param !== null) {
                await controller[action](param, res);
            } else {
                await controller[action](res);
            }
        } catch (e) {
            console.error('coreErrorRouter-callAction', e.message);
            utils.jsonResponse(res, { error: `Erro ao executar ação: ${e.message}` }, 500);
        }
    }
}

module.exports = Router;