'use strict';

// This code is copied from the file application.js in koa
// Link: https://github.com/koajs/koa/blob/master/lib/application.js

const statuses = require('statuses');

/**
 * Response helper.
 */
/* istanbul ignore next */
function respond(ctx) {
    // allow bypassing koa
    if (false === ctx.respond) return;

    if (!ctx.writable) return;

    const res = ctx.res;
    let body = ctx.body;
    const code = ctx.status;

    // ignore body
    if (statuses.empty[code]) {
        // strip headers
        ctx.body = null;
        return res.end();
    }

    if ('HEAD' === ctx.method) {
        if (!res.headersSent && !ctx.response.has('Content-Length')) {
            const { length } = ctx.response;
            if (Number.isInteger(length)) ctx.length = length;
        }
        return res.end();
    }

    // status body
    if (null == body) {
        if (ctx.response._explicitNullBody) {
            ctx.response.remove('Content-Type');
            ctx.response.remove('Transfer-Encoding');
            return res.end();
        }
        if (ctx.req.httpVersionMajor >= 2) {
            body = String(code);
        } else {
            body = ctx.message || String(code);
        }
        if (!res.headersSent) {
            ctx.type = 'text';
            ctx.length = Buffer.byteLength(body);
        }
        return res.end(body);
    }

    // responses
    if (Buffer.isBuffer(body)) return res.end(body);
    if ('string' === typeof body) return res.end(body);
    if (body instanceof Stream) return body.pipe(res);

    // body: json
    body = JSON.stringify(body);
    if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body);
    }
    res.end(body);
}

module.exports = respond;
