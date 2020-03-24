process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('app', () => {
  it('status: 404, path not found', () => {
    return request(app)
      .get('/api/apples')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('path not found');
      });
  });
  describe('/api', () => {
    describe('/topics', () => {
      describe('GET', () => {
        it('status: 200, responds with an array', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              expect(topics).to.be.an('array');
              expect(topics).to.have.lengthOf(3);
            });
        });
        it('status: 200, each object has expected keys', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body: { topics } }) => {
              topics.forEach(topic => {
                expect(topic).to.contain.keys('slug', 'description');
              });
            });
        });
      });
    });
    describe('/users', () => {
      describe('/users/:username', () => {
        describe('GET', () => {
          it('status: 200, responds with an object', () => {
            return request(app)
              .get('/api/users/lurker')
              .expect(200)
              .then(({ body: { user } }) => {
                expect({ user }).to.be.an('object');
              });
          });
          it('status: 200, responds with the correct keys', () => {
            return request(app)
              .get('/api/users/lurker')
              .expect(200)
              .then(({ body: { user } }) => {
                expect(user).to.contain.keys('username', 'avatar_url', 'name');
              });
          });
          it('status: 404, valid but non-existent username', () => {
            return request(app)
              .get('/api/users/hello')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('user does not exist');
              });
          });
        });
      });
    });
    describe('/articles', () => {
      describe('/:article_id', () => {
        describe('GET', () => {
          it('status: 200, responds with an object with the correct keys', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article).to.contain.keys(
                  'author',
                  'title',
                  'article_id',
                  'body',
                  'topic',
                  'created_at',
                  'votes'
                );
              });
          });
          it('status: 200, object has a comment_count key with the correct value', () => {
            return request(app)
              .get('/api/articles/1')
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.comment_count).to.eql(13);
              });
          });
          it('status: 404, valid but non - existent id', () => {
            return request(app)
              .get('/api/articles/100')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article does not exist');
              });
          });
          it('status: 400, invalid id', () => {
            return request(app)
              .get('/api/articles/hello')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('PATCH', () => {
          it('status: 200, returns article with correct id and correctly patched', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({ inc_votes: 10 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(110);
              });
          });
          it('status: 404, valid but non - existent id', () => {
            return request(app)
              .patch('/api/articles/100')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article does not exist');
              });
          });
          it('status: 400, invalid data-type', () => {
            return request(app)
              .patch('/api/articles/2')
              .send({ inc_votes: 'cat' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status: 200, no inc_votes on request body', () => {
            return request(app)
              .patch('/api/articles/1')
              .send({})
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(100);
              });
          });
        });
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
