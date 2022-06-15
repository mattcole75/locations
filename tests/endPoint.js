const supertest = require('supertest');
const baseUrl = 'http://localhost:6791/';

const endPoint = supertest(baseUrl);

module.exports = endPoint;