process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

describe('app', () => {
  describe('/api', () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe('/topics', () => {
      describe.only('GET', () => {
        it('status: 200, responds with an array', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an('array');
            });
        });
      });
    });
    describe('/users', () => {
      describe('GET', () => {});
    });
    describe('/articles', () => {
      describe('/:article_id', () => {
        describe('GET', () => {});
        describe('PATCH', () => {});
      });
      describe('/:article_id/comments', () => {
        describe('GET', () => {});
        describe('POST', () => {});
      });
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        describe('GET', () => {});
        describe('POST', () => {});
      });
    });
  });
});