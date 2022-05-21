// Description: Jest tests to support a TDD development approach
// Developer: Matt Cole
// Date created: 2022-05-14
// Change history:
//  1. 

const endPoint = require('./endPoint');
const locations = require('../data/location');

let level1Res;
let level2Res;
let level3Res;

// let idA;
// let idB;
// let idB;

describe('Test the location microservice POST methods', () => {

    locations.forEach(location1 => {

        it('should, create a location given the right information', async () => {
            await endPoint.post('/location')
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

describe('Test the location microservice GET methods', () => {

    it('should successfully return a location given the correct id', async () => {
        await endPoint.get('/location')
            .set({
                id: level1Res.insertedId
                // idToken: idToken2,
                // localId: localId2
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
                // idToken: idToken2,
                // localId: localId2
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

    it('should successfully return all level 2 locations when given no parameters', async () => {
        await endPoint.get('/locations')
            .set({
                id: level1Res.insertedId
                // idToken: idToken2,
                // localId: localId2
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

    it('should successfully return all level 3 locations when given no parameters', async () => {
        await endPoint.get('/locations')
            .set({
                id: level2Res.insertedId
                // idToken: idToken2,
                // localId: localId2
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
                name: 'City'
                // idToken: idToken2,
                // localId: localId2
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

describe('Test the location microservice PATCH methods', () => {
    
    let id;

    it('should successfully return all locations using a text filter', async () => {
        await endPoint.get('/locations')
            .set({
                name: 'John Rylands Research Institute'
                // idToken: idToken2,
                // localId: localId2
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
                id: id
                // localId: localId2,
                // idToken: idToken2
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
                name: 'John Rylands Research Institute'
                // idToken: idToken2,
                // localId: localId2
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