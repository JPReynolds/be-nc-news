process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiSorted = require('chai-sorted');
chai.use(chaiSorted);
const { expect } = chai;
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection');

after(() => {
  return connection.destroy();
});

describe('app', () => {
  describe('/api', () => {
    describe('/topics', () => {
      describe('GET', () => {});
    });
    describe('/users', () => {
      describe('GET', () => {});
    });
    describe('/articles', () => {
      describe('/:article_id', () => {
        describe('GET', () => {});
        describes('PATCH', () => {});
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
