// Description: Jest tests to support a TDD development approach
// Developer: Matt Cole
// Date created: 2022-05-14
// Change history:
//  1. 

const endPoint = require('./endPoint');
const auth = require('./authEndPoint');
const locations = require('../data/location');
const crypto = require('crypto');
const { send } = require('process');

let level1Res;
let level2Res;
let level3Res;

const wrongToken = '7c58e9e7cd20ae44f354d59f7a73ebb7e346d5e5a61517e33e0e97c4c79d25a826debfc57ca2e99c66108f80801059a9d2d94d14886fc98539e4ab324a5da2e125aa7e7d26af000e103fcbc75b0ed9caa75895ba26efa248fc0c2154a581786679c6a2a9120fadc9e68fef80bc30d6a8644cd19362e035a85e130d675e2e30a9';


let localId;
let idToken;

describe('Test the auth call to ensure only valid tokens can POST locations', () => {

    locations.forEach(location => {
        it('should, fail to create a location given no token', async () => {
            await endPoint.post('/location')
                .set({
                    
                })
                .send({
                    name: location.name,
                    description: location.description,
                    address: {
                        line1: location.address.line1,
                        line2: location.address.line2,
                        city: location.address.city,
                        postcode: location.address.postcode
                    },
                    latitude: location.latitude,
                    longitude: location.longitude,
                    what3words: location.what3words,
                    created:  location.created,
                    updated: location.updated,
                    inuse: location.inUse
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
        });
    });

    locations.forEach(location => {
        it('should, fail to create a location given empty token', async () => {
            await endPoint.post('/location')
                .set({
                    idToken: ''
                })
                .send({
                    name: location.name,
                    description: location.description,
                    address: {
                        line1: location.address.line1,
                        line2: location.address.line2,
                        city: location.address.city,
                        postcode: location.address.postcode
                    },
                    latitude: location.latitude,
                    longitude: location.longitude,
                    what3words: location.what3words,
                    created:  location.created,
                    updated: location.updated,
                    inuse: location.inUse
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
        });
    });

    locations.forEach(location => {
        it('should, fail to create a location given un-authorised token', async () => {
            await endPoint.post('/location')
                .set({
                    idToken: wrongToken
                })
                .send({
                    name: location.name,
                    description: location.description,
                    address: {
                        line1: location.address.line1,
                        line2: location.address.line2,
                        city: location.address.city,
                        postcode: location.address.postcode
                    },
                    latitude: location.latitude,
                    longitude: location.longitude,
                    what3words: location.what3words,
                    created:  location.created,
                    updated: location.updated,
                    inuse: location.inUse
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
        });
    });
});

describe('Test the location microservice POST methods', () => {

    it('should, login and return the user details and token', async () => {
        await auth.post('/user/login')
            .send({
                email: 'fitz.farseer@system.com',
                password: crypto.createHash('sha256').update('letmein').digest('hex')
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.user.displayName).toBe('Fitz Farseer');
                expect(res.body.user.email).toBe('fitz.farseer@system.com');
                expect(res.body.user.idToken).toHaveLength(256);
                idToken = res.body.user.idToken;        
            })
    });


    locations.forEach(location1 => {

        it('should, create a location given the right information', async () => {
            await endPoint.post('/location')
                .set({
                    idToken: idToken
                })
                .send({
                    name: location1.name,
                    description: location1.description,
                    address: {
                        line1: location1.address.line1,
                        line2: location1.address.line2,
                        city: location1.address.city,
                        postcode: location1.address.postcode
                    },
                    latitude: location1.latitude,
                    longitude: location1.longitude,
                    what3words: location1.what3words,
                    created:  location1.created,
                    updated: location1.updated,
                    inuse: location1.inUse
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(201);
                    expect(res.body.data.acknowledged === true);
                    expect(res.body.data.insertedId);
                    level1Res = res.body.data;
                })
        });

        location1.sublocations && location1.sublocations.forEach(location2 => {

            it('should, create a location given the right information', async () => {
                await endPoint.post('/location')
                .set({
                    idToken: idToken
                })
                .send({
                    parentRef: level1Res.insertedId,
                    name: location2.name,
                    description: location2.description,
                    what3words: location2.what3words,
                    created:  location2.created,
                    updated: location2.updated,
                    inuse: location2.inUse
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .then(res => {
                    expect(res.body).toBeDefined();
                    expect(res.body.status).toBe(201);
                    expect(res.body.data.acknowledged === true);
                    expect(res.body.data.insertedId);
                    level2Res = res.body.data;
                })
            })

            location2.sublocations && location2.sublocations.forEach(location3 => {

                it('should, create a location given the right information', async () => {
                    await endPoint.post('/location')
                    .set({
                        idToken: idToken
                    })
                    .send({
                        parentRef: level2Res.insertedId,
                        locale: location3.locale,
                        name: location3.name,
                        description: location3.description,
                        what3words: location3.what3words,
                        created:  location3.created,
                        updated: location3.updated,
                        inuse: location3.inUse
                    })
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .then(res => {
                        expect(res.body).toBeDefined();
                        expect(res.body.status).toBe(201);
                        expect(res.body.data.acknowledged === true);
                        expect(res.body.data.insertedId);
                        level3Res = res.body.data;
                    })
                })
            })
        });
    });
});
describe('Test the auth call to ensure only valid tokens can GET locations', () => {

    it('should fail to return a location given the correct id with no token', async () => {
        await endPoint.get('/location')
            .set({
                id: level1Res.insertedId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return a location given the correct id with empty token', async () => {
        await endPoint.get('/location')
            .set({
                id: level1Res.insertedId,
                idToken: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return a location given the correct id with un-authorised token', async () => {
        await endPoint.get('/location')
            .set({
                id: level1Res.insertedId,
                idToken: wrongToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

    it('should fail to return all level 1 locations when given no token', async () => {
        await endPoint.get('/locations')
            .set({
                
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return all level 1 locations when given empty token', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return all level 1 locations when given un-authorised token', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: wrongToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

    it('should fail tp return all level 2 locations when given parent id and no token', async () => {
        await endPoint.get('/locations')
            .set({
                id: level1Res.insertedId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail tp return all level 2 locations when given parent id and empty token', async () => {
        await endPoint.get('/locations')
            .set({
                id: level1Res.insertedId,
                idToken: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail tp return all level 2 locations when given parent id and un-authorised token', async () => {
        await endPoint.get('/locations')
            .set({
                id: level1Res.insertedId,
                idToken: wrongToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

    it('should fail to return all level 3 locations when given parent id and no token', async () => {
        await endPoint.get('/locations')
            .set({
                id: level2Res.insertedId
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return all level 3 locations when given parent id and empty token', async () => {
        await endPoint.get('/locations')
            .set({
                id: level2Res.insertedId,
                idToken: ''
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return all level 3 locations when given parent id and un-authorised token', async () => {
        await endPoint.get('/locations')
            .set({
                id: level2Res.insertedId,
                idToken: wrongToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

    it('should fail to return all locations using a text filter and no token', async () => {
        await endPoint.get('/locations')
            .set({
                
            })
            .send({
                name: 'City'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return all locations using a text filter and empty token', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: ''
            })
            .send({
                name: 'City'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should fail to return all locations using a text filter and un-authorised token', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: wrongToken
            })
            .send({
                name: 'City'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });
});

describe('Test the location microservice GET methods', () => {

    it('should successfully return a location given the correct id', async () => {
        await endPoint.get('/location')
            .set({
                id: level1Res.insertedId,
                idToken: idToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                // console.log(res.body);
            })
    });

    it('should successfully return all level 1 locations when given no parameters', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: idToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(2);
            })
    });

    it('should successfully return all level 2 locations when given parent id', async () => {
        await endPoint.get('/locations')
            .set({
                id: level1Res.insertedId,
                idToken: idToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(1);
            })
    });

    it('should successfully return all level 3 locations when given parent id', async () => {
        await endPoint.get('/locations')
            .set({
                id: level2Res.insertedId,
                idToken: idToken
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(5);
            })
    });

    it('should successfully return all locations using a text filter', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: idToken
            })
            .send({
                name: 'City'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(3);
            })
    });
});

describe('Test the auth call to ensure only valid tokens can PATCH locations', () => {

    let id;

    it('should successfully return all locations using a text filter', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: idToken
            })
            .send({
                name: 'John Rylands Research Institute'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(1);
                id = res.body.data[0]._id;
            })
    });

    it('should, fail to patch a location given the right information and no token', async () => {
        await endPoint.patch('/location')
            .set({
                id: id
            })
            .send({
                description: 'Creative Space for Software Engineering'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should, fail to patch a location given the right information and empty token', async () => {
        await endPoint.patch('/location')
            .set({
                id: id,
                idToken: ''
            })
            .send({
                description: 'Creative Space for Software Engineering'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
    });

    it('should, fail to patch a location given the right information and un-authorised token', async () => {
        await endPoint.patch('/location')
            .set({
                id: id,
                idToken: wrongToken
            })
            .send({
                description: 'Creative Space for Software Engineering'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    });

});

describe('Test the location microservice PATCH methods', () => {
    
    let id;

    it('should successfully return all locations using a text filter', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: idToken
            })
            .send({
                name: 'John Rylands Research Institute'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(1);
                id = res.body.data[0]._id;
            })
    });

    it('should, patch a location given the right information', async () => {
        await endPoint.patch('/location')
            .set({
                id: id,
                idToken: idToken
            })
            .send({
                description: 'Creative Space for Software Engineering'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data.acknowledged === true);
                expect(res.body.data.modifiedCount === 1);
                expect(res.body.data.upsertedCount === 0);
                expect(res.body.data.matchedCount === 1);
            })
    });

    it('should successfully return all locations using a text filter', async () => {
        await endPoint.get('/locations')
            .set({
                idToken: idToken
            })
            .send({
                name: 'John Rylands Research Institute'
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                expect(res.body).toBeDefined();
                expect(res.body.status).toBe(200);
                expect(res.body.data).toHaveLength(1);
                expect(res.body.data[0].description).toBe('Creative Space for Software Engineering');
            })
    });
});