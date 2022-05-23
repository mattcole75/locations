// Description: Setup configuration for supertest auth API end point
// Developer: Matt Cole
// Date created: 2022-05-21
// Change history:
//  1. 

const supertest = require('supertest');
const authUrl = 'http://localhost:5791/auth/api/0.1'

const auth = supertest(authUrl);

module.exports = auth;