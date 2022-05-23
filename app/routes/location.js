// Description: Provides the routes for the auth functionality
// Developer: Matt Cole
// Date created: 2022-04-23
// Change history:
//  1. 

const config = require('../../configuration/config');
const application = config.get('application');
const version = config.get('version');
const location = require('../controller/location');

module.exports = (app) => {

    app.post('/' + application + '/api/' + version + '/location', (req, res) => {
        location.post(req, (err, loc) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(loc.status).send(loc);
        });
    });

    app.patch('/' + application + '/api/' + version + '/location', (req, res) => {
        location.patch(req, (err, loc) => {
            res.set('Content-Type', 'application/json');
            if(err)
                res.status(err.status).send(err);
            else
                res.status(loc.status).send(loc);
        });
    });

    app.get('/' + application + '/api/' + version + '/location', (req, res) => {
        res.set('Content-Type', 'application/json');
        location.get(req, (err, loc) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(loc.status).send(loc);
        });
    });

    app.get('/' + application + '/api/' + version + '/locations', (req, res) => {
        res.set('Content-Type', 'application/json');
        location.all(req, (err, loc) => {
            if(err)
                res.status(err.status).send(err);
            else
                res.status(loc.status).send(loc);
        });
    });
}