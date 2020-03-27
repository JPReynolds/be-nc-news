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
      describe('INVALID METHODS', () => {
        it('status: 405, invalid method', () => {
          const methods = ['delete', 'put', 'patch', 'post'];
          const promiseArr = methods.map(method => {
            return request(app)
              [method]('/api/topics')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(promiseArr);
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
        describe('INVALID METHODS', () => {
          it('status: 405, invalid method', () => {
            const methods = ['delete', 'put', 'patch', 'post'];
            const promiseArr = methods.map(method => {
              return request(app)
                [method]('/api/users/1')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promiseArr);
          });
        });
      });
    });
    describe('/articles', () => {
      describe('GET', () => {
        it('status: 200, responds with an array of articles', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.an('array');
              expect(articles).to.have.length(12);
            });
        });
        it('status: 200, each article has default keys', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              articles.forEach(article => {
                expect(article).to.contain.keys(
                  'author',
                  'title',
                  'article_id',
                  'topic',
                  'created_at',
                  'votes'
                );
              });
            });
        });
        it('status: 200, default sort_by by created_at and is descending', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('created_at');
            });
        });
        it('status: 200, can accept a sort_by query default to descending', () => {
          return request(app)
            .get('/api/articles?sort_by=article_id')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.descendingBy('article_id');
            });
        });
        it('status: 200, can accept an order query', () => {
          return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.be.ascending;
            });
        });
        it('status: 200, can accept author filter', () => {
          return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(3);
            });
        });
        it('status: 200, can accept topic filter', () => {
          return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(11);
            });
        });
        it('status: 200, each object has a comment_count property', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles[0].comment_count).to.equal('13');
            });
        });
        it('status: 400, sort_by a column that doesnt exist', () => {
          return request(app)
            .get('/api/articles?sort_by=apples')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status: 400, order not asc/desc', () => {
          return request(app)
            .get('/api/articles/order=apples')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status: 404, author/topic not in the database', () => {
          return request(app)
            .get('/api/articles?author=apples')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('user does not exist');
            });
        });
        it('status: 200, author / topic that exists but does not have any articles associated with it', () => {
          return request(app)
            .get('/api/articles?author=lurker')
            .expect(200)
            .then(({ body: { articles } }) => {
              expect(articles).to.have.length(0);
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status: 405, invalid method', () => {
          const methods = ['delete', 'put', 'patch', 'post'];
          const promiseArr = methods.map(method => {
            return request(app)
              [method]('/api/articles')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(promiseArr);
        });
      });
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
        describe('INVALID METHODS', () => {
          it('status: 405, invalid method', () => {
            const methods = ['delete', 'put', 'post'];
            const promiseArr = methods.map(method => {
              return request(app)
                [method]('/api/articles/1')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promiseArr);
          });
        });
      });
      describe('/:article_id/comments', () => {
        describe('POST', () => {
          it.only('status: 201, inserts comment object and responds with the posted comment', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 'butter_bridge', body: 'well written article' })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment).to.contain.keys(
                  'comment_id',
                  'author',
                  'body',
                  'votes',
                  'created_at'
                );
                expect(comment.votes).to.equal(0);
              });
          });
          it('status: 422, references article_id in another table that doesnt exist', () => {
            return request(app)
              .post('/api/articles/100/comments')
              .send({ username: 'butter_bridge', body: 'well written article' })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessible entity');
              });
          });
          it('status: 422, references a username in another table that doesnt exist', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 'hello', body: 'well written article' })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessible entity');
              });
          });
          it('status: 400, missing column on body', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ body: 'apples' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('GET', () => {
          it('status: 200, responds with an array of objects with the correct keys', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.an('array');
                comments.forEach(comment => {
                  expect(comment).to.contain.keys(
                    'comment_id',
                    'votes',
                    'created_at',
                    'author',
                    'body'
                  );
                });
              });
          });
          it('status: 200, can sort_by comment_id', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=comment_id')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy('comment_id');
              });
          });
          it('status: 200, can sort_by author', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=author')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy('author');
              });
          });
          it('status: 200, default sort_by is descending by created_at', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.descendingBy('created_at');
              });
          });
          it('status: 200, responds with an empty array when valid id but no comments', () => {
            return request(app)
              .get('/api/articles/2/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.have.length(0);
              });
          });
          it('status: 404, valid but non-existent article-id', () => {
            return request(app)
              .get('/api/articles/100/comments')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article does not exist');
              });
          });
          it('status: 400, invalid article-id', () => {
            return request(app)
              .get('/api/articles/hello/comments')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status: 400, invalid sort_by query', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=hello')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
        });
        describe('INVALID METHODS', () => {
          it('status: 405, invalid method', () => {
            const methods = ['delete', 'put', 'patch'];
            const promiseArr = methods.map(method => {
              return request(app)
                [method]('/api/articles/1/comments')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promiseArr);
          });
        });
      });
    });
    describe('/comments', () => {
      describe('/:comment_id', () => {
        describe('PATCH', () => {
          it('status: 200, returns updated comment', () => {
            return request(app)
              .patch('/api/comments/2')
              .send({ inc_votes: 1 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal('15');
              });
          });
          it('status: 404, valid but non - existent id', () => {
            return request(app)
              .patch('/api/comments/100')
              .send({ inc_votes: '1' })
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('comment does not exist');
              });
          });
          it('status: 400, invalid data-type', () => {
            return request(app)
              .patch('/api/comments/2')
              .send({ inc_votes: 'cat' })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status: 200, no inc_votes on request body', () => {
            return request(app)
              .patch('/api/comments/2')
              .send({})
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal('14');
              });
          });
        });
        describe('DELETE', () => {
          it('status: 204, no content upon successful deletion of house', () => {
            return request(app)
              .delete('/api/comments/1')
              .expect(204);
          });
          it('status: 404, valid but non-existent comment_id', () => {
            return request(app)
              .delete('/api/comments/100')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('comment_id not found');
              });
          });
        });
        describe('INVALID METHODS', () => {
          it('status: 405, invalid method', () => {
            const methods = ['put', 'post', 'get'];
            const promiseArr = methods.map(method => {
              return request(app)
                [method]('/api/comments/1')
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal('method not allowed');
                });
            });
            return Promise.all(promiseArr);
          });
        });
      });
    });
  });
});
