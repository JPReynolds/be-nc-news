# Northcoders News API

This project is a RESTful API built using node.js, express and PostgreSQL. The purpose of the API is to be used by the Northcoders News website. The link to the deployed API and the front end github respository can be seen below.

- Deployed API: https://jordans-nc-news.herokuapp.com/
- Front End: https://github.com/JPReynolds/fe-nc-news.git

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Node.js v13.8.0 - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- PostgreSQL - [Download & Install PostgreSQL](https://www.postgresql.org/)

### Installing

Clone the repository in the terminal using:

```
git clone https://github.com/JPReynolds/be-nc-news.git

cd be-nc-news
```

Install dependencies:

```
npm install
```

Connect to the database:

```
npm run setup-dbs
```

Your application should run on port 9090 with the development environment configuration. Use the following command to listen on the port using nodemon:

```
npm start
```

Connect to port using:

```
http://localhost:9090/api
```

## Running the tests

To run the tests for the API:

```
npm test
```

To run the tests for the utils functions:

```
npm test-utils
```

### API Tests

These tests are used to test whether each endpoint available on the API returns the correct response when provided with a valid request. As well as returning the appropriate error code when recieving an invalid request. For example, the code below tests whether the api returns a status code of 404 and a message of 'path not found', when given an invalid path of /api/apples.

```
describe('app', () => {
  it('status: 404, path not found', () => {
    return request(app)
      .get('/api/apples')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('path not found');
      });
  });
}
```

### Utils Tests

The utils functions purpose is to convert the data into a format that can be added into the database. The tests for the functions are to test whether the data is in the correct format. For example:

```
describe('formatComments', () => {
  it('returns a new empty array, when passed an empty array', () => {
    expect(formatComments([], {})).to.eql([]);
  });
}
```
