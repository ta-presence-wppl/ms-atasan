const express = require('express');
const router = express.Router();
 
//Define Async
const async = require('async');

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
router.get('/', validator.validate("check_history"), validator.verify, (req, res, next) => {
    var myDate = {
        id_peg: req.user_data.id_peg,
        time: moment().format('kk:mm:ssZ'),
        date: moment(req.query.date).format('YYYY-MM-D')
    }
    new AbsentControllers().getAllAbsent(myDate).then(x => {
        for (const [key, value] of Object.entries(x)) {
            value['foto_msk'] = value.foto_msk != null ? 'https://api-ta-presence-gateaway.behindrailstudio.com/storage/ms-absent/images/in/' + value.foto_msk : null;
            value['foto_plg'] = value.foto_plg != null ? 'https://api-ta-presence-gateaway.behindrailstudio.com/storage/ms-absent/images/out/' + value.foto_plg : null;
        }
        res.json({
            message: 'Sukses GET Absen History',
            data: x,
            date: moment().format()
        })
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