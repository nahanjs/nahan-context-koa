'use strict';

const Koa = require('koa');
const respond = require('./lib/respond');
const onFinished = require('on-finished');

function ContextKoa(options) {

    const app = new Koa(options);

    async function context_koa(ctx, next) {

        const { req, res } = ctx;
        const kao_ctx = app.createContext(req, res);

        ctx._nh = ctx._nh || {};
        ctx._nh.ctx_koa = true;
        ctx._nh_new = kao_ctx;

        res.statusCode = 404;
        const onerror = err => kao_ctx.onerror(err);
        onFinished(res, onerror);
        try {
            await next();
            respond(kao_ctx);
        } catch (err) {
            onerror(err);
        }
    };

    return context_koa;
}

module.exports = ContextKoa;
