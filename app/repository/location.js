// Description: Provides the repository for the location app
// Developer: Matt Cole
// Date created: 2022-05-14
// Change history:
//  1. 

const { ObjectId } = require('mongodb');
const database = require('../../configuration/database');

const post = (req, next) => {

    const dbConnect = database.getDb();

    dbConnect
        .collection('location')
        .insertOne(req, (err, res) => {
        if (err)
            next({ status: 500, msg: err }, null);
        else
            next(null, { status: 201, data: res });
    });
}

const patch = (req, next) => {

    const dbConnect = database.getDb();
    const id = new ObjectId(req.id);

    dbConnect
        .collection('location')
        .updateOne(
            { _id: id },
            { $set: req.body},
            { upsert: true }, 
            function (err, res) {
            if (err)
                next({status: 500, msg: err}, null);
            else if (res.acknowledged === true && res.modifiedCount === 1 && res.upsertedId === null && res.upsertedCount === 0)
                next(null, {status: 200, data: res});
            else
                next({status: 400, msg: "Invalid request"}, null);
    });
}

const get = (req, next) => {

    const dbConnect = database.getDb();
    const id = new ObjectId(req.id);

    dbConnect
        .collection('location')
        .findOne({ _id: id }, ((err, res) => {
            if(err)
                next({ status: 500, msg: err }, null);
            else if(!res)
                next({status: 404, msg: "Not found"}, null);
            else
                next(null, {status: 200, data: res});
        }));
}

const all = (req, next) => {

    const dbConnect = database.getDb();

    let query;
    
    if (req.id)
        query = { parentRef: req.id }
    else if (req.name)
        query = {$text: { $search: req.name, $caseSensitive: false }}
    else
        query = { parentRef: { $exists: false }};

    dbConnect
        .collection('location')
        .find(query)
        // .limit(200)
        .toArray(function (err, result) {
        if (err) 
            next({status: 400, msg: err}, null);
        else 
            next(null, {status: 200, data: result});
        
        });
}

module.exports = {
    post: post,
    patch: patch,
    get: get,
    all: all
}