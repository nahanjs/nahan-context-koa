'use strict';

const request = require('supertest');
const expect = require('chai').expect;

const { Pipeline, Branch } = require('nahan-onion');
const ContextKoa = require('..');

describe('ContextKoa', () => {

    it('test', done => {
        const app = ctx => ContextKoa()(ctx, () => { });
        request((req, res) => app({ req, res }))
            .get('/').expect(404).expect('Not Found', done);
    });

    it('test', done => {
        const app = Pipeline(
            async (ctx, next) => {
                try {
                    await next();
                } catch (err) {
                    expect(err).is.an.instanceOf(Error);
                    expect(err.message).to.eql('123');
                    ctx.res.statusCode = 500;
                    ctx.res.end('error');
                }
            },
            ContextKoa(),
            (ctx) => { throw Error('123') },
        );
        request((req, res) => app({ req, res })).
            get('/').expect(500).expect('error', done);
    });
});
