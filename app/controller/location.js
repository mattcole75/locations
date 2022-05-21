// Description: Provides the co-ordination for the auth functionality
// Developer: Matt Cole
// Date created: 2022-01-29
// Change history:
//  1.

const location = require('../repository/location');
const log = require('../../utility/logger')();
const config = require('../../configuration/config');
const version = config.get('version');

const moment = require('moment');

const post = (req, next) => {

    location.post(
        {   ...req.body,
            inuse: true,
            updated: moment().format(),
            created: moment().format()
        }, 
        (err, res) => {
        if(err) {
            log.error({ type: "POST", version: version, status: err.status, message: err.msg });
            next(err, null);
        }
        else {
            log.info({ type: "POST", version: version, status: res.status, data: res });
            next(null, res);
        }
    });
}

const patch = (req, next) => {

    const params = { id: req.headers.id, body: { ...req.body,  updated: moment().format() } };
    location.patch(params, (err, res) => {
        if(err) {
            log.error({ type: "POST", version: version, status: err.status, message: err.msg });
            next(err, null);
        } else {
            log.info({ type: "POST", version: version, status: res.status, data: res });
            next(null, res);
        }
    });
}

const get = (req, next) => {

    location.get(req.headers, (err, res) => {
        if(err) {
            log.error({ type: "POST", version: version, status: err.status, message: err.msg });
            next(err, null);
        } else {
            log.info({ type: "POST", version: version, status: res.status, message: "ok" });
            next(null, res);
        }
    });
}

const all = (req, next) => {

    location.all(req.headers, (err, res) => {
        if(err) {
            log.error({ type: "POST", version: version, status: err.status, message: err.msg });
            next(err, null);
        } else {
            log.info({ type: "POST", version: version, status: res.status, message: "ok" });
            next(null, res);
        }
    });
}

// const logout = (req, next) => {

//     const errors = validate(req.headers, postLogoutRules);

//     if(errors.length > 0) {
//         log.error(`POST v${version} - validation failure - logout - status: 400, msg: ${errors}`);
//         next({status: 400, msg: 'Bad request - validation failure'}, null);
//     } else {
//         const params = { localId: req.headers.localid, idToken: req.headers.idtoken};
//         auth.removeToken(params, (err, res) => {
//             if(err) {
//                 log.error(`POST v${version} - failed - getUser - status: ${err.status} msg: ${err.msg}`);
//                 next(err, null);
//             } else {
//                 next(null, res);
//             }
//         });
//     }
// }

// const isAuthenticated = (req, next) => {

//     let errors = [];

//     if( req.headers.localid && req.headers.localid != null && req.headers.localid !== null && req.headers.localid !== '' && req.headers.localid !== 'null' &&
//         req.headers.idtoken && req.headers.idtoken != null && req.headers.idtoken !== null && req.headers.idtoken !== '' && req.headers.idtoken !== 'null') {
//         errors = validate(req.headers, getTokenRules);
//     } else {
//         log.error(`POST v${version} - validation failure - isAuthenticated - status: 400, msg: request header parameters missing`);
//         return next({status: 401, msg: 'Unauthorised'}, null);
//     }   

//     if(errors.length > 0) {
//         log.error(`POST v${version} - validation failure - isAuthenticated - status: 400, msg: ${errors}`);
//         next({status: 400, msg: 'Bad request - validation failure'}, null);
//     } else {
//         const params = { idToken: req.headers.idtoken, localId: req.headers.localid };
//         auth.isAuthenticated(params, (err, data) => {
//             if(err) {
//                 log.error(`POST v${version} - failed - isAuthenticated - status: ${err.status} msg: ${err.msg}`);
//                 next(err, null);
//             } else {
//                 // log.info(`POST v${version} - success - getIdFromToken - status ${data.status}`);
//                 next(null, data);
//             }
//         });
//     }
// }



// const patchUserEmail = (req, next) => {

//     const errors = validate(req.body, patchUserEmailRules);

//     if(errors.length > 0) {
//         log.error(`POST v${version} - validation failure - logout - status: 400, msg: ${errors}`);
//         next({status: 400, msg: 'Bad request - validation failure'}, null);
//     } else {
//         const params = { localId: req.headers.localid, idToken: req.headers.idtoken, data: { email: req.body.email, updated: moment().format() } };
//         auth.patchUser(params, (err, res) => {
//             if(err) {
//                 log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
//                 next(err, null);
//             } else {
//                 next(null, res);
//             }
//         });
//     }
// }

// const patchUserPassword = (req, next) => {

//     const errors = validate(req.body, patchUserPasswordRules);

//     const salt = crypto.randomBytes(256);
//     const hash = genHash(req.body.password, salt);

//     if(errors.length > 0) {
//         log.error(`POST v${version} - validation failure - logout - status: 400, msg: ${errors}`);
//         next({status: 400, msg: 'Bad request - validation failure'}, null);
//     } else {
//         const params = { localId: req.headers.localid, idToken: req.headers.idtoken, data: { salt: salt.toString('hex'), password: hash, updated: moment().format() } };
//         auth.patchUser(params, (err, res) => {
//             if(err) {
//                 log.error(`POST v${version} - failed - patchUser - status: ${err.status} msg: ${err.msg}`);
//                 next(err, null);
//             } else {
//                 next(null, res);
//             }
//         });
//     }
// }

// const testToken = (req, next) => {

//     let errors = [];
//     if(req.headers.idtoken && req.headers.idtoken != null) {
//         errors = validate(req.headers, testTokenRules);
//     } else {
//         log.error(`POST v${version} - validation failure - testToken - status: 400, msg: request header parameters missing`);
//         return next({status: 400, msg: 'Bad request - validation failure'}, null);
//     }
    
//     if(errors.length > 0) {
//         log.error(`POST v${version} - validation failure - testToken - status: 400, msg: ${errors}`);
//         next({status: 400, msg: 'Bad request - validation failure'}, null);
//     } else {
//         auth.testToken(req.headers, (err, res) => {
//             if(err) {
//                 log.error(`POST v${version} - failed - testToken - status: ${err.status} msg: ${err.msg}`);
//                 next(err, null);
//             } else {
//                 next(null, res);
//             }
//         });
//     }
// }

module.exports = {
    post: post,
    patch: patch,
    get: get,
    all: all
}