'use strict';

function ContextKoa() {

    async function context_koa(ctx,next){
        await next();
    };

    return context_koa;
}

module.exports = ContextKoa;
