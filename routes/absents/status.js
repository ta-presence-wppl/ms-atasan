const express = require('express');
const router = express.Router();
var fs = require('fs');

//Define Async
const async = require('async');

//Panggil Path Node
const path = require('path');

//Define Controllers
const AbsentControllers = require('../../controllers/absent');

//Define Validator Body
const validator = require('./authValidator');

//Moment JS
var moment = require('moment');

//Sample Route
/**
 * @swagger
 * /auth:
 *   post:
 *     description: Auth User
 *     responses:
 *       200:
 *          description: Returns one User Specified.
 *          data: Some data user
 *          token: Return token to Verified User
 *     body:
 *          - email
 *          - password
 */
router.get('/', (req, res, next) => {
    var myDate = {
        id_peg: req.user_data.id_peg,
        time: moment().format('kk:mm:ssZ'),
        date: moment().format('YYYY-MM-D')
    }
    new AbsentControllers().checkAbsentIn(myDate).then(x => {
        if (x) {
            res.send({
                message: 'Sudah Melakukan Absen Kedatangan!',
                data: x
            })
        } else {
            res.send({
                message: 'Belum Melakukan Absen Kedatangan!',
                data: null
            })
        }
    }).catch(err => {
        var details = {
            parent: err.parent,
            name: err.name,
            message: err.message
        }
        var error = new Error("Error pada server");
        error.status = 500;
        error.data = {
            date: new Date(),
            route: req.originalUrl,
            details: details
        };
        next(error);
    });
});

//exports
module.exports = router;